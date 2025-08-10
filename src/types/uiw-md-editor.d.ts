declare module '@uiw/react-md-editor' {
    import * as React from 'react'
    export interface MDEditorProps {
        value?: string
        onChange?: (value?: string) => void
        preview?: 'edit' | 'live' | 'preview'
        height?: number
        textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>
        previewOptions?: unknown
    }
    const MDEditor: React.ComponentType<MDEditorProps>
    export default MDEditor
}
