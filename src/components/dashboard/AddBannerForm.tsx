"use client";

import { ImageUploadField } from '@/components/shared/form/image-upload-field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

interface AddBannerFormProps {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
  buttonText: string;
  onCancel: () => void;
}

export default function AddBannerForm({
  formData,
  setFormData,
  onSubmit,
  isPending,
  buttonText,
  onCancel,
}: AddBannerFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto px-1 pr-3 scrollbar-hide">
      <div className="grid grid-cols-2 gap-6">
        {/* Title */}
        <div className="space-y-2 col-span-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Banner Title <span className="text-red-500">*</span></label>
            <Input required placeholder="e.g., Summer Sale" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="rounded-xl border-slate-200 focus:border-orange-500" />
        </div>

        {/* Subtitle */}
        <div className="space-y-2 col-span-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Subtitle</label>
            <Input placeholder="e.g., Up to 50% off" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="rounded-xl border-slate-200 focus:border-orange-500" />
        </div>

        {/* Link */}
        <div className="space-y-2 col-span-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Link URL</label>
            <Input placeholder="https://example.com" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} className="rounded-xl border-slate-200 focus:border-orange-500" />
        </div>

        {/* Order */}
        <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Display Order</label>
            <Input type="number" placeholder="1" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} className="rounded-xl border-slate-200 focus:border-orange-500" />
        </div>

        {/* Image */}
        <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-500">Banner Image</label>
            </div>
            <ImageUploadField
                field={{
                    name: "imageUrl",
                    state: { value: formData.imageUrl, meta: { isTouched: false, errors: [] } },
                    handleChange: (val: string) => setFormData({ ...formData, imageUrl: val })
                } as any}
                label="Banner Image"
            />
        </div>
      </div>

      <div className="flex flex-wrap gap-6 py-6 border-t border-b bg-slate-50/50 dark:bg-slate-950/20 -mx-1 px-4 rounded-xl">
          <div className="flex items-center space-x-3">
              <Switch checked={formData.isActive} onCheckedChange={(c) => setFormData({ ...formData, isActive: c })} className="data-checked:bg-green-500" />
              <label className="text-sm font-medium">Active</label>
          </div>
      </div>

      <div className="pt-2 flex justify-end gap-3 mt-6 pb-2">
          <Button type="button" variant="outline" onClick={onCancel} className="rounded-xl px-6 hover:bg-primary/10">Cancel</Button>
          <Button type="submit" disabled={isPending} className="rounded-xl px-8 bg-fire text-white font-semibold hover:bg-fire-dark">
              {isPending ? "Saving..." : buttonText}
          </Button>
      </div>
    </form>
  )
}
