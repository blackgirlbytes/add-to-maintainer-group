import {MarkdownEditor} from '@primer/react/drafts'
import React from "react";
import { SquirrelIcon, BugIcon  } from "@primer/octicons-react";

const renderMarkdown = async (markdown) => 'Rendered Markdown.'

export default function  MinimalExample({handleSubmitToAppealRejection}){
  const [value, setValue] = React.useState('')

  return (
    <MarkdownEditor value={value} onChange={setValue} onRenderPreview={renderMarkdown}>
      <MarkdownEditor.Label visuallyHidden>Custom Buttons</MarkdownEditor.Label>
      <MarkdownEditor.Actions>
       <button onClick={handleSubmitToAppealRejection}>test </button>
      </MarkdownEditor.Actions>
    </MarkdownEditor>
  )
}

// renderMarkdown(MinimalExample)