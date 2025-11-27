"use client";

import React from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function RichTextEditor({ value, onChange }: Props) {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        className="text-white"
      />
    </div>
  );
}
