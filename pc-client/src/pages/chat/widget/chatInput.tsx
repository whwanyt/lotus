import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button } from 'antd'
import { IMMessageTypes } from '@/plugins/im/enum'
import { IMMessage, IMTextMessage } from '@/plugins/im/model'
import IMClient from '@/plugins/im/socket'
import Placeholder from '@tiptap/extension-placeholder'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import DOMPurify from 'dompurify'
import './edit.less'

const im = IMClient.getInstance()
function ChatInput({ roomId, pushMessag }: { roomId: string; pushMessag: (message: IMMessage) => void }) {
  const onSend = async () => {
    if (!roomId) return
    let val = editor!.getText({ blockSeparator: '\n' })
    if (val.trimStart().length === 0) return
    const textMessage: IMTextMessage = {
      text: DOMPurify.sanitize(val)
    }
    const message = await im.sendMessage({
      roomId: roomId,
      content: {
        type: IMMessageTypes.text,
        extra: '',
        content: textMessage
      }
    })
    editor?.commands.setContent('')
    pushMessag(message)
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: '请输入'
      })
    ],
    content: ''
  })

  return (
    <div className="h-36 p-2 shadow shadow-indigo-500/40">
      <EditorContent editor={editor} />
      <div className="pt-1 flex justify-end">
        <Button onClick={onSend}>发送</Button>
      </div>
    </div>
  )
}

export default ChatInput
