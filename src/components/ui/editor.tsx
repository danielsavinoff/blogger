"use client"

import * as Y from "yjs"
import Highlight from "@tiptap/extension-highlight"
import Typography from "@tiptap/extension-typography"
import StarterKit from "@tiptap/starter-kit"
import Heading from "@tiptap/extension-heading"
import Collaboration from "@tiptap/extension-collaboration"
import CollaborationCursor from "@tiptap/extension-collaboration-cursor"
//import Image from '@tiptap/extension-image'
import CharacterCount from '@tiptap/extension-character-count'
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion'
import { EditorContent, mergeAttributes, useEditor, FloatingMenu, Extension, ExtensionConfig, ReactRenderer, Editor as TipTapEditor, Range, NodeViewWrapper, ReactNodeViewRenderer, Node } from "@tiptap/react"
import { useEffect, useMemo, useRef, useState } from "react"
import { WebsocketProvider } from "y-websocket"
import { Popover } from "@/components/ui/popover"
import { CheckIcon, ImageIcon, KeyboardIcon, PlusIcon } from "@radix-ui/react-icons"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./dropdown-menu"
import { Button } from "./button"
import tippy, { Instance, Props, Tippy } from "tippy.js"
import { cn } from "@/lib/utils"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import { blobToBase64URL } from "@/lib/blobToBase64URL"

export function Editor({
  link,
  room,
  editable,
  onIdle,
  timeBeforeIdle = 0,
  onUpdate,
  onWordCountChange
}: {
  link: string
  room: string
  editable?: boolean
  onIdle?: (content?: string) => void
  timeBeforeIdle?: number
  onUpdate?: (content?: string) => void
  onWordCountChange?: (count: number) => void
}) {
  const ydoc = useMemo(() => new Y.Doc(), [])
  const provider = useMemo(() => new WebsocketProvider(link, room, ydoc), [])

  const timeout = useRef<NodeJS.Timeout | number>()

  const editor = useEditor({
    extensions: [
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider: provider,
        render: (user) => {
          const cursor = document.createElement("span")

          cursor.setAttribute(
            "class",
            "border-l border-r ml-[-1px] mr-[-1px] whitespace-nowrap rounded-full animate-in fade-in-0 fade-out-100 repeat-infinite ease-[steps(1,end)] duration-1000 box-border",
          )

          cursor.style.borderColor = user.color

          return cursor
        },
      }),
      StarterKit.configure({
        history: false,
      }),
      Highlight,
      Typography,
      Heading.extend({
        renderHTML({ node, HTMLAttributes }) {
          const level = this.options.levels.includes(node.attrs.level)
            ? node.attrs.level
            : this.options.levels[0]

          const classes: { [index: number]: string } = {
            1: "text-4xl font-bold",
            2: "text-3xl font-bold",
            3: "text-2xl font-bold",
            4: "text-xl font-bold",
            5: "text-lg font-bold",
            6: "text-base font-bold",
          }

          return [
            `h${level}`,
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
              class: `${classes[level]}`,
            }),
            0,
          ]
        },
      }),
      Image,
      CharacterCount,
      SlashCommands.configure({
        suggestion: {
          render: () => {
            let component: ReactRenderer
            let popup: Instance<Props>[]

            return({
              onStart: (props) => {
                component = new ReactRenderer(CommandList, {
                  props,
                  editor: props.editor,
                })
                
                if (!props.clientRect) return

                popup = tippy('body', {
                  getReferenceClientRect: props.clientRect as () => DOMRect,
                  appendTo: () => document.body,
                  content: component.element,
                  showOnCreate: true,
                  interactive: true,
                  trigger: 'manual',
                  placement: 'bottom-start',
                })
              },
              onUpdate(props) {
                component.updateProps(props)
        
                if (!props.clientRect) {
                  return
                }
        
                popup[0].setProps({
                  getReferenceClientRect: props.clientRect as () => DOMRect,
                })
              },
        
              onKeyDown(props) {
                if (props.event.key === 'Escape') {
                  popup[0].hide()
        
                  return true
                }
        
                return component.ref?.onKeyDown(props)
              },
        
              onExit() {
                popup[0].destroy()
                component.destroy()
              },
            })
          },
          items: ({ query }) => {
            return([
              {
                title: 'Heading 1',
                command: ({ editor, range }: { editor: TipTapEditor, range: Range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode('heading', { level: 1 })
                    .run()
                },
              },
              {
                title: 'Heading 2',
                command: ({ editor, range }: { editor: TipTapEditor, range: Range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode('heading', { level: 2 })
                    .run()
                },
              },
              {
                title: 'Heading 3',
                command: ({ editor, range }: { editor: TipTapEditor, range: Range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode('heading', { level: 3 })
                    .run()
                },
              },
              {
                title: 'Heading 4',
                command: ({ editor, range }: { editor: TipTapEditor, range: Range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode('heading', { level: 4 })
                    .run()
                },
              },
              {
                title: 'Heading 5',
                command: ({ editor, range }: { editor: TipTapEditor, range: Range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode('heading', { level: 5 })
                    .run()
                },
              },
              {
                title: 'Heading 6',
                command: ({ editor, range }: { editor: TipTapEditor, range: Range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode('heading', { level: 6 })
                    .run()
                },
              },
              {
                title: 'Image',
                command: ({ editor, range }: { editor: TipTapEditor, range: Range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setImage()
                    .run()
                },
              },
              {
                title: 'Bold',
                command: ({ editor, range }: { editor: TipTapEditor, range: Range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setMark('bold')
                    .run()
                },
              },
              {
                title: 'Italic',
                command: ({ editor, range }: { editor: TipTapEditor, range: Range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setMark('italic')
                    .run()
                },
              },
            ].filter(item => item.title.toLowerCase().startsWith(query.toLowerCase())).slice(0, 10))
          },
          startOfLine: true
        }
      })
    ],
    editorProps: {
      attributes: {
        class: "focus:outline-none",
        autofocus: "true",
      },
    },
    onUpdate: () => {
      if (typeof onUpdate === "function") onUpdate(editor?.getHTML())

      if (
        typeof timeBeforeIdle === "number" &&
        timeBeforeIdle > 0 &&
        typeof onIdle === "function"
      ) {
        if (timeout.current) {
          clearTimeout(timeout.current)

          timeout.current = undefined
        }

        timeout.current = setTimeout(() => {
          onIdle(editor?.getHTML())

          timeout.current = undefined
        }, timeBeforeIdle)
      }
    },
  })

  useEffect(() => editor?.setEditable(!!editable), [editable])

  useEffect(() => {
    if (typeof onWordCountChange === 'function')
      onWordCountChange(editor?.storage?.characterCount.words())
  }, [editor?.storage?.characterCount.words()])

  return (
    <EditorContent
      editor={editor}
      className="focus:outline-none flex-1 cursor-text"
      onClick={() => editor?.commands.focus()}
    />
  )
}

const SlashCommands = Extension.create<{ 
  suggestion: Omit<SuggestionOptions, 'editor'>
}, any>({
  name: "slashCommands",

  addOptions() {
    return({ 
      suggestion: {
        char: "/",
        startOfLine: false,
        command: ({ 
          editor, 
          range, 
          props
        }) => {
          props.command({ editor, range, props });
        }
      }}
    )
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion
      })
    ];
  }
})

const CommandList = (props: Record<string, any>) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  const selectItem = (index: number) => {
    const item = props.items[index]

    if (item) {
      item.command({ editor: props.editor, range: props.range })
    }
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [props.items])

  // useImperativeHandle(ref, () => ({
  //   onKeyDown: ({ event }) => {
  //     if (event.key === 'ArrowUp') {
  //       upHandler()
  //       return true
  //     }

  //     if (event.key === 'ArrowDown') {
  //       downHandler()
  //       return true
  //     }

  //     if (event.key === 'Enter') {
  //       enterHandler()
  //       return true
  //     }

  //     return false
  //   },
  // }))

  return (
    <div className="z-50 min-w-56 h-[50dvh] max-h-72 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
      <div className="h-full p-1 overflow-auto">
        {Array.isArray(props.items) && props.items.length
          ? props.items.map((item, index) => (
            <button
              className={cn([
                'w-full flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                index === selectedIndex && 'is-selected'
              ])}
              key={index}
              onClick={() => selectItem(index)}
            >
              {item?.title}
              {index === selectedIndex && (
                <span className="flex h-3.5 w-3.5 ml-auto items-center justify-center">
                  <CheckIcon className="h-4 w-4" />
                </span>
              )}
            </button>
          ))
          : <div className="item">No result</div>
        }
      </div>
    </div>
  )
}

export interface ImageOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      /**
       * Add an image
       */
      setImage: (options: {
        src?: string;
        alt?: string;
        title?: string;
      }) => ReturnType;
    };
  }
}

type ImageComponentProps = {
  node: {
    attrs: {
      src: string;
    };
  };
};
function ImageComponent(props: ImageComponentProps) {
  const { node } = props;

  // swap this for your API file upload code
  const { mutateAsync: upload, submittedAt } = { mutateAsync: (arg: any) => void 0, submittedAt: undefined };

  const [src, setSrc] = useState<string | undefined>(node?.attrs?.src);

  useEffect(() => {
    if (node.attrs.src?.startsWith('data:') && !submittedAt) {
      async function uploadImage() {
        const formData = new FormData();
        const base64 = node.attrs.src.split(',')[1];
        const file = window.atob(base64);

        formData.set(
          'file',
          new Blob([file], { type: 'image/png' }),
          'image.png'
        );

        const uploadedFile = await upload({
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (!uploadedFile) return;
        setSrc(uploadedFile.url);
      }

      uploadImage();
    }
  }, [node.attrs.src]);

  return (
    <NodeViewWrapper className="w-full">
      <img src={src} className="w-full" />
    </NodeViewWrapper>
  );
}

const Image = Node.create<ImageOptions>({
  name: 'image',

  addOptions() {
    return {
      inline: false,
      allowBase64: false,
      HTMLAttributes: {},
    };
  },

  inline: false,
  group: 'block',

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]:not([src^="data:"])',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'img',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent);
  },

  addCommands() {
    return {
      setImage:
        (options) =>
          ({ commands }) => {
            return commands.insertContent({
              type: this.name,
              attrs: options,
            });
          },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('imageDrop'),
        props: {
          handleDOMEvents: {
            drop: async (view, event) => {
              if (event?.dataTransfer?.files) {
                const files = event.dataTransfer.files;
                const file = files.item(0);

                if (file && file.type.includes('image')) {
                  const dataUrl = await blobToBase64URL(file);
                  
                  return this.editor.chain().setImage({ src: dataUrl }).run();
                }
              }
              return false;
            },
          },
        },
      }),
    ];
  },
});