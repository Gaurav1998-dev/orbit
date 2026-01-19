"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface TagsInputProps {
  id?: string
  value?: string[]
  defaultValue?: string[]
  onChange?: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
  disabled?: boolean
  className?: string
  tagClassName?: string
  inputClassName?: string
  allowDuplicates?: boolean
}

function TagsInput({  
  id,
  value,
  defaultValue = [],
  onChange,
  placeholder = "Add a tag...",
  maxTags,
  disabled = false,
  className,
  tagClassName,
  inputClassName,
  allowDuplicates = false,
}: TagsInputProps) {
  const [internalTags, setInternalTags] = React.useState<string[]>(defaultValue)
  const [inputValue, setInputValue] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const tags = value ?? internalTags
  const isControlled = value !== undefined

  const updateTags = React.useCallback(
    (newTags: string[]) => {
      if (!isControlled) {
        setInternalTags(newTags)
      }
      onChange?.(newTags)
    },
    [isControlled, onChange]
  )

  const addTag = React.useCallback(
    (tag: string) => {
      const trimmedTag = tag.trim()
      if (!trimmedTag) return
      if (!allowDuplicates && tags.includes(trimmedTag)) return
      if (maxTags && tags.length >= maxTags) return

      updateTags([...tags, trimmedTag])
      setInputValue("")
    },
    [tags, updateTags, allowDuplicates, maxTags]
  )

  const removeTag = React.useCallback(
    (indexToRemove: number) => {
      updateTags(tags.filter((_, index) => index !== indexToRemove))
    },
    [tags, updateTags]
  )

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault()
        addTag(inputValue)
      } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
        removeTag(tags.length - 1)
      } else if (e.key === "," || e.key === "Tab") {
        if (inputValue.trim()) {
          e.preventDefault()
          addTag(inputValue)
        }
      }
    },
    [inputValue, addTag, removeTag, tags.length]
  )

  const handleContainerClick = () => {
    inputRef.current?.focus()
  }

  const handlePaste = React.useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault()
      const pastedText = e.clipboardData.getData("text")
      const pastedTags = pastedText.split(/[,\n\t]+/).filter((tag) => tag.trim())
      
      let newTags = [...tags]
      for (const tag of pastedTags) {
        const trimmedTag = tag.trim()
        if (!trimmedTag) continue
        if (!allowDuplicates && newTags.includes(trimmedTag)) continue
        if (maxTags && newTags.length >= maxTags) break
        newTags.push(trimmedTag)
      }
      
      updateTags(newTags)
    },
    [tags, updateTags, allowDuplicates, maxTags]
  )

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className={cn(
        "flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-3 py-1.5 text-base shadow-xs transition-[color,box-shadow] md:text-sm",
        "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
        "dark:bg-input/30",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      {tags.map((tag, index) => (
        <Badge
          key={`${tag}-${index}`}
          variant="secondary"
          className={cn(
            "h-6 gap-1 pl-2 pr-1 text-xs font-normal animate-in fade-in-0 zoom-in-95",
            tagClassName
          )}
        >
          <span className="max-w-[150px] truncate">{tag}</span>
          {!disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                removeTag(index)
              }}
              className="ml-0.5 rounded-sm p-0.5 opacity-60 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
              aria-label={`Remove ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </Badge>
      ))}
      <input
        id={id}
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        placeholder={tags.length === 0 ? placeholder : ""}
        disabled={disabled || (maxTags !== undefined && tags.length >= maxTags)}
        className={cn(
          "flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed",
          "min-w-[80px]",
          inputClassName
        )}
        aria-label="Add tag"
      />
    </div>
  )
}

export { TagsInput }