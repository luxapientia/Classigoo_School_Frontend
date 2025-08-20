"use client";
import { useState, useEffect } from "react";
import RegentsExamActivityLayout from "@components/pages/learning/regents-exam/RegentsExamActivityLayout";
import QuestionEditor from "./QuestionEditor";
import ReviewNavigation from "./ReviewNavigation";
import ReviewStats from "./ReviewStats";
import ApprovalActions from "./ApprovalActions";
import axios from "@lib/axios";

export default function EditQuestionsMode({
  grade, 
  subjectName, 
  subjectTitle, 
  apiEndpoint,
  currentIndex,
  backgroundIndex,
  onBackToDashboard 
}) {
  // State management
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [editedQuestion, setEditedQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    unapproved: 0
  });

  // Fetch all questions for review
  const fetchQuestionsForReview = async () => {
    setLoading(true);
    setError(null);
    try {
      const gradeNumber = Math.max(Number(grade), 3);
      const { data: res } = await axios.get(`/v1/learning/nys/${apiEndpoint}/review?grade=${gradeNumber}`);
      
      if (res.status === "success" && res.data) {
        setQuestions(res.data.questions || []);
        setStats(res.data.stats || { total: 0, approved: 0, unapproved: 0 });
        setCurrentQuestionIndex(0);
        
        // Initialize edited question with first question
        if (res.data.questions && res.data.questions.length > 0) {
          setEditedQuestion({ ...res.data.questions[0] });
        }
      } else {
        setError(res.message || "Failed to fetch questions");
        setQuestions([]);
        setStats({ total: 0, approved: 0, unapproved: 0 });
      }
    } catch (err) {
      console.error("Error fetching questions for review:", err);
      setError("Network error occurred");
      setQuestions([]);
      setStats({ total: 0, approved: 0, unapproved: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Handle question navigation
  const goToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
      setEditedQuestion({ ...questions[index] });
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      goToQuestion(currentQuestionIndex + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      goToQuestion(currentQuestionIndex - 1);
    }
  };

  // Handle question updates
  const handleQuestionChange = (field, value) => {
    setEditedQuestion(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOptionChange = (optionKey, value) => {
    setEditedQuestion(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [optionKey]: value
      }
    }));
  };

  // Handle approve question
  const handleApproveQuestion = async () => {
    if (!editedQuestion) return;
    
    setLoading(true);
    try {
      const { data: res } = await axios.put(`/v1/learning/nys/${apiEndpoint}/approve/${editedQuestion._id}`, {
        problem: editedQuestion.problem,
        options: editedQuestion.options,
        correctAnswer: editedQuestion.correctAnswer,
        explanation: editedQuestion.explanation,
        topic: editedQuestion.topic,
        grade: editedQuestion.grade
      });
      
      if (res.status === "success") {
        // Update the question in the list
        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestionIndex] = { ...editedQuestion, is_approved: true };
        setQuestions(updatedQuestions);
        
        // Update stats
        setStats(prev => ({
          ...prev,
          approved: prev.approved + (questions[currentQuestionIndex].is_approved ? 0 : 1)
        }));
        
        // Move to next question if available
        if (currentQuestionIndex < questions.length - 1) {
          goToNextQuestion();
        }
      } else {
        setError(res.message || "Failed to approve question");
      }
    } catch (err) {
      console.error("Error approving question:", err);
      setError("Failed to approve question");
    } finally {
      setLoading(false);
    }
  };

  // Handle reject question
  const handleRejectQuestion = async () => {
    if (!editedQuestion) return;
    
    setLoading(true);
    try {
      const { data: res } = await axios.delete(`/v1/learning/nys/${apiEndpoint}/reject/${editedQuestion._id}`);
      
      if (res.status === "success") {
        // Remove the question from the list
        const updatedQuestions = questions.filter((_, index) => index !== currentQuestionIndex);
        setQuestions(updatedQuestions);
        
        // Update stats
        setStats(prev => ({
          ...prev,
          total: prev.total - 1,
          approved: questions[currentQuestionIndex].is_approved ? prev.approved - 1 : prev.approved,
          unapproved: questions[currentQuestionIndex].is_approved ? prev.unapproved : prev.unapproved - 1
        }));
        
        // Adjust current index if necessary
        if (updatedQuestions.length === 0) {
          setEditedQuestion(null);
          setCurrentQuestionIndex(0);
        } else {
          const newIndex = currentQuestionIndex >= updatedQuestions.length ? 
            updatedQuestions.length - 1 : currentQuestionIndex;
          setCurrentQuestionIndex(newIndex);
          setEditedQuestion({ ...updatedQuestions[newIndex] });
        }
      } else {
        setError(res.message || "Failed to reject question");
      }
    } catch (err) {
      console.error("Error rejecting question:", err);
      setError("Failed to reject question");
    } finally {
      setLoading(false);
    }
  };

  // Initialize component
  useEffect(() => {
    fetchQuestionsForReview();
  }, [grade, apiEndpoint]);

  // Loading state
  if (loading && questions.length === 0) {
    return (
      <RegentsExamActivityLayout title={`${subjectTitle} - Edit Questions`} currentIndex={currentIndex} backgroundIndex={backgroundIndex} grade={grade}>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-lg text-gray-500">Loading questions...</div>
        </div>
      </RegentsExamActivityLayout>
    );
  }

  // Error state
  if (error && questions.length === 0) {
    return (
      <RegentsExamActivityLayout title={`${subjectTitle} - Edit Questions`} currentIndex={currentIndex} backgroundIndex={backgroundIndex} grade={grade}>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-lg text-red-500 mb-4">Error: {error}</div>
          <button
            onClick={fetchQuestionsForReview}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Retry
          </button>
          <button
            onClick={onBackToDashboard}
            className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </RegentsExamActivityLayout>
    );
  }

  // No questions state
  if (questions.length === 0) {
    return (
      <RegentsExamActivityLayout title={`${subjectTitle} - Edit Questions`} currentIndex={currentIndex} backgroundIndex={backgroundIndex} grade={grade}>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-lg text-gray-500 mb-4">No questions available for review</div>
          <button
            onClick={onBackToDashboard}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </RegentsExamActivityLayout>
    );
  }

  // Main edit mode UI
  return (
    <RegentsExamActivityLayout title={`${subjectTitle} - Edit Questions`} currentIndex={currentIndex} backgroundIndex={backgroundIndex} grade={grade}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with navigation */}
        <ReviewNavigation 
          currentIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          onPrevious={goToPrevQuestion}
          onNext={goToNextQuestion}
          canGoPrevious={currentQuestionIndex > 0}
          canGoNext={currentQuestionIndex < questions.length - 1}
        />

        {/* Statistics */}
        <ReviewStats stats={stats} currentIndex={currentQuestionIndex} />

        {/* Error display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-700">{error}</div>
          </div>
        )}

        {/* Question Editor */}
        {editedQuestion && (
          <QuestionEditor 
            question={editedQuestion}
            onChange={handleQuestionChange}
            onOptionChange={handleOptionChange}
            isApproved={questions[currentQuestionIndex]?.is_approved || false}
          />
        )}

        {/* Action Buttons */}
        {editedQuestion && (
          <ApprovalActions 
            onApprove={handleApproveQuestion}
            onReject={handleRejectQuestion}
            onBackToDashboard={onBackToDashboard}
            isLoading={loading}
            isApproved={questions[currentQuestionIndex]?.is_approved || false}
          />
        )}
      </div>
    </RegentsExamActivityLayout>
  );
} 