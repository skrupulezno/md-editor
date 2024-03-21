import { Bold, Eraser, Italic, Underline } from 'lucide-react'
import styles from './EmailEditor.module.scss'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { emailService } from '../../services/email.service'
import { useEditor } from './useEditor'
import MarkdownPreview from '@uiw/react-markdown-preview';

export function EmailEditor() {
  const {applyFormat, text, setText, updateSelection, textRef } = useEditor()

  const queryClient = useQueryClient()

  const {mutate, isPending} = useMutation({
    mutationKey: ['create email'],
    mutationFn: () => emailService.addEmails(text),
      onSuccess() {
        setText(``),
        queryClient.refetchQueries({ queryKey: ['email list']})
      },
  })

  return (
    <div>
      <h1>md editor</h1>
      {text && <MarkdownPreview source={text} className={styles.preview} />}
      <div className={styles.card}>
        <textarea 
          wrap='off'
          ref={textRef}
          className={styles.editor} 
          spellCheck='false'
          onSelect={updateSelection}
          value={text}
          onChange={e => setText(e.target.value)}/>
        <div className={styles.actions}>
        <div className={styles.tools}>
          <button onClick={() => setText('')}>
            <Eraser fontSize={17}/>
          </button>
          <button onClick={() => applyFormat('bold')}>
            <Bold fontSize={17}/>
          </button>
          <button onClick={() => applyFormat('italic')}>
            <Italic fontSize={17}/>
          </button>
          <button onClick={() => applyFormat('underline')}>
            <Underline fontSize={17}/>
          </button>
        </div>
        <button disabled={isPending} onClick={() => text ? mutate(): alert("you cant send clear messages")}>Send now</button>
      </div>
      </div>
    </div>
  )
}
