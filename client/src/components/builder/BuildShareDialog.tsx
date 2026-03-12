import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog"
import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import { Label } from "@components/ui/label"
import { Switch } from "@components/ui/switch"
import { Badge } from "@components/ui/badge"
import { Share2, Copy, Check, Twitter, Linkedin } from "lucide-react"

interface Build {
  name: string
  shareId: string
  isPublic: boolean
  createdAt: string
  totalPrice?: number
}

interface BuildShareDialogProps {
  build: Build
  shareUrl?: string
  onCopyLink?: () => void
  onTogglePublic?: (isPublic: boolean) => void
  trigger?: React.ReactNode
  className?: string
}

export function BuildShareDialog({
  build,
  shareUrl: shareUrlProp,
  onCopyLink,
  onTogglePublic,
  trigger,
  className,
}: BuildShareDialogProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (shareUrlProp) {
      await navigator.clipboard.writeText(shareUrlProp)
      setCopied(true)
      onCopyLink?.()
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShare = async (platform: "twitter" | "linkedin") => {
    const url = shareUrlProp || `${window.location.origin}/builds/${build.shareId}`
    const text = `Check out my PC build: ${build.name}`

    let platformShareUrl = ""
    switch (platform) {
      case "twitter":
        platformShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      case "linkedin":
        platformShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
    }

    window.open(platformShareUrl, "_blank", "width=600,height=400")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className={className}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Build</DialogTitle>
          <DialogDescription>
            Share your build with others or keep it private
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Public/Private Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Public Build</Label>
              <p className="text-xs text-muted-foreground">
                Allow others to view your build
              </p>
            </div>
            <Switch
              checked={build.isPublic}
              onCheckedChange={(checked) => onTogglePublic?.(checked)}
            />
          </div>

          {build.isPublic && (
            <Badge variant="secondary" className="w-full justify-center py-2">
              This build is publicly visible
            </Badge>
          )}

          {/* Share URL */}
          <div className="space-y-2">
            <Label htmlFor="share-url">Share Link</Label>
            <div className="flex gap-2">
              <Input
                id="share-url"
                value={shareUrlProp || `${window.location.origin}/builds/${build.shareId}`}
                readOnly
                className="flex-1"
              />
              <Button
                variant="secondary"
                size="icon"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            {copied && (
              <p className="text-xs text-muted-foreground">Link copied to clipboard!</p>
            )}
          </div>

          {/* Social Share */}
          {build.isPublic && (
            <div className="space-y-2">
              <Label>Share on Social Media</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleShare("twitter")}
                >
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleShare("linkedin")}
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </Button>
              </div>
            </div>
          )}

          {/* Build Info */}
          <div className="pt-4 border-t text-sm text-muted-foreground">
            <p>Build ID: {build.shareId}</p>
            <p>Created: {new Date(build.createdAt).toLocaleDateString()}</p>
            {build.totalPrice && (
              <p>Total Value: ${build.totalPrice.toFixed(2)}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
