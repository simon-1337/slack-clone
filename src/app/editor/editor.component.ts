import { Component } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent {


  config = {
    toolbar: [
       ['bold', 'italic', 'underline', 'strike'],
       ['code-block'],
       [{ list: 'ordered' }, { list: 'bullet' }],
       ['emoji'],
    ],
 }
}
