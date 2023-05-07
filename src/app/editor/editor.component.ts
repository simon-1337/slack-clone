import { Component } from '@angular/core';
import 'quill-emoji/dist/quill-emoji.js';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent {

  editorContent: string;

  config = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['emoji'],
    ],
    'emoji-toolbar': true,
    'emoji-textarea': false,
    'emoji-shortname': true

  }

  getContent() {
    return this.editorContent;
  }

  clearContent() {
    this.editorContent = '';
  }

  get isEditorEmpty() {
    return !this.editorContent || /^\s*$/.test(this.editorContent);
  }

}
