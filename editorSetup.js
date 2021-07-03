import { EditorState, basicSetup } from "@codemirror/basic-setup";
import { EditorView, keymap } from "@codemirror/view";
import { defaultTabBinding } from "@codemirror/commands";
import {json} from "@codemirror/lang-json"

export default function editorSetups() {
  const requestBody = document.querySelector("[data-request-body]");
  const responseBody = document.querySelector("[data-response-body]");

  const Extensions = [
    basicSetup,
    keymap.of([defaultTabBinding]),
    json(),
    EditorState.tabSize.of(2),
  ];

  const requestEditor = new EditorView({
    state: EditorState.create({
      doc: "{\n\t\n}",
      extensions: Extensions,
    }),
    parent: requestBody,
  });

  const responseEditor = new EditorView({
    state: EditorState.create({
      doc: "{}",
      extensions: [...Extensions, EditorView.editable.of(false)],
    }),
    parent: responseBody,
  });

  const updateResponse = (value) => {
    responseEditor.dispatch({
      changes: {
        from: 0,
        to: responseEditor.state.doc.length,
        insert: JSON.stringify(value, null, 2),
      },
    });
  };

  return { requestEditor, updateResponse };
}
