"use client";

import React from "react";
import { useTheme } from "next-themes";

import { Editor } from "@tinymce/tinymce-react";

if (typeof window !== "undefined") {
  // TinyMCE so the global var exists
  require("tinymce/tinymce");
  // DOM model
  require("tinymce/models/dom/model");
  // Theme
  require("tinymce/themes/silver");
  // Toolbar icons
  require("tinymce/icons/default");
  // Editor styles
  require("tinymce/skins/ui/oxide/skin");

  // importing the plugin js.
  // if you use a plugin that is not listed here the editor will fail to load
  require("tinymce/plugins/advlist");
  require("tinymce/plugins/anchor");
  require("tinymce/plugins/autolink");
  require("tinymce/plugins/autoresize");
  require("tinymce/plugins/autosave");
  require("tinymce/plugins/charmap");
  require("tinymce/plugins/code");
  require("tinymce/plugins/codesample");
  require("tinymce/plugins/directionality");
  require("tinymce/plugins/emoticons");
  require("tinymce/plugins/fullscreen");
  require("tinymce/plugins/help");
  require("tinymce/plugins/help/js/i18n/keynav/en");
  require("tinymce/plugins/image");
  require("tinymce/plugins/importcss");
  require("tinymce/plugins/insertdatetime");
  require("tinymce/plugins/link");
  require("tinymce/plugins/lists");
  require("tinymce/plugins/media");
  require("tinymce/plugins/nonbreaking");
  require("tinymce/plugins/pagebreak");
  require("tinymce/plugins/preview");
  require("tinymce/plugins/quickbars");
  require("tinymce/plugins/save");
  require("tinymce/plugins/searchreplace");
  require("tinymce/plugins/table");
  require("tinymce/plugins/visualblocks");
  require("tinymce/plugins/visualchars");
  require("tinymce/plugins/wordcount");

  // importing plugin resources
  require("tinymce/plugins/emoticons/js/emojis");

  // Content styles, including inline UI like fake cursors
  require("tinymce/skins/content/default/content");
  require("tinymce/skins/content/dark/content");
  require("tinymce/skins/ui/oxide/content");
  require("tinymce/skins/ui/oxide-dark/content");
  require("tinymce/skins/ui/oxide-dark/skin");
}
export default function TinyEditor(props) {
  console.log(window);
  const { theme } = useTheme();
  return (
    <Editor
      licenseKey="gpl"
      promotion={false}
      init={{
        plugins: "link lists autoresize",
        promotion: false,
        branding: false,
        highlight_on_focus: false,
        skin: theme === "dark" ? "oxide-dark" : "oxide",
        content_css: theme === "dark" ? "dark" : "default",
        ...props.init,
      }}
      onEditorChange={(v) => props?.onChange(v)}
    />
  );
}
