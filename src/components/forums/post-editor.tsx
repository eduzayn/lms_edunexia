import * as React from "react";
import { Button } from "../ui/button";
import { Bold, Italic, List, ListOrdered, Image, Link, HelpCircle } from "lucide-react";

interface PostEditorProps {
  initialContent?: string;
  placeholder?: string;
  submitLabel?: string;
  onSubmit: (content: string) => Promise<void>;
  onCancel?: () => void;
  isReply?: boolean;
}

export function PostEditor({
  initialContent = "",
  placeholder = "Escreva sua mensagem aqui...",
  submitLabel = "Enviar",
  onSubmit,
  onCancel,
  isReply = false
}: PostEditorProps) {
  const [content, setContent] = React.useState(initialContent);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const editorRef = React.useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(content);
      setContent("");
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
    } catch (error) {
      console.error("Error submitting post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const insertFormat = (format: string) => {
    const selection = window.getSelection();
    if (!selection || !editorRef.current) return;
    
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    let formattedText = "";
    switch (format) {
      case "bold":
        formattedText = `<strong>${selectedText || "texto em negrito"}</strong>`;
        break;
      case "italic":
        formattedText = `<em>${selectedText || "texto em itálico"}</em>`;
        break;
      case "ul":
        formattedText = `<ul><li>${selectedText || "item da lista"}</li></ul>`;
        break;
      case "ol":
        formattedText = `<ol><li>${selectedText || "item da lista"}</li></ol>`;
        break;
      case "link":
        const url = prompt("Digite a URL do link:", "https://");
        if (url) {
          formattedText = `<a href="${url}" target="_blank">${selectedText || url}</a>`;
        }
        break;
      case "image":
        const imageUrl = prompt("Digite a URL da imagem:", "https://");
        if (imageUrl) {
          formattedText = `<img src="${imageUrl}" alt="${selectedText || "Imagem"}" style="max-width: 100%;" />`;
        }
        break;
      default:
        return;
    }
    
    if (formattedText) {
      document.execCommand("insertHTML", false, formattedText);
      updateContent();
    }
  };

  const updateContent = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  return (
    <div className={`border rounded-md overflow-hidden ${isReply ? 'border-muted' : ''}`}>
      {!isReply && (
        <div className="flex items-center gap-1 p-2 border-b bg-muted/50">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => insertFormat("bold")}
            title="Negrito"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => insertFormat("italic")}
            title="Itálico"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => insertFormat("ul")}
            title="Lista com marcadores"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => insertFormat("ol")}
            title="Lista numerada"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => insertFormat("link")}
            title="Inserir link"
          >
            <Link className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => insertFormat("image")}
            title="Inserir imagem"
          >
            <Image className="h-4 w-4" />
          </Button>
          
          <div className="ml-auto flex items-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-xs text-muted-foreground"
            >
              <HelpCircle className="h-3 w-3" />
              <span>Formatação</span>
            </Button>
          </div>
        </div>
      )}
      
      <div
        ref={editorRef}
        className={`min-h-[120px] ${isReply ? 'min-h-[80px]' : ''} p-3 focus:outline-none`}
        contentEditable
        dangerouslySetInnerHTML={{ __html: initialContent }}
        onInput={updateContent}
        onBlur={updateContent}
        placeholder={placeholder}
        style={{ overflowY: 'auto' }}
      />
      
      <div className="flex items-center justify-end gap-2 p-2 border-t bg-muted/30">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        )}
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={handleSubmit}
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting ? "Enviando..." : submitLabel}
        </Button>
      </div>
    </div>
  );
}
