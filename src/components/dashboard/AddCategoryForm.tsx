"use client";

import { ImageUploadField } from '@/components/shared/form/image-upload-field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

interface AddCategoryFormProps {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
  buttonText: string;
  onCancel: () => void;
}

export default function AddCategoryForm({
  formData,
  setFormData,
  onSubmit,
  isPending,
  buttonText,
  onCancel,
}: AddCategoryFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto px-1 pr-3 scrollbar-hide">
      <div className="grid grid-cols-2 gap-6">
        {/* Name */}
        <div className="space-y-2 col-span-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Category Name <span className="text-red-500">*</span></label>
            <Input required placeholder="e.g., Burgers" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="rounded-xl border-slate-200 focus:border-orange-500" />
        </div>

        {/* Description */}
        <div className="space-y-2 col-span-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
            <Textarea 
                placeholder="Brief description of the category..." 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="rounded-xl border-slate-200"
            />
        </div>

        {/* Image */}
        <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-500">Category Image</label>
            </div>
            <ImageUploadField
                field={{
                    name: "imageUrl",
                    state: { value: formData.imageUrl, meta: { isTouched: false, errors: [] } },
                    handleChange: (val: string) => setFormData({ ...formData, imageUrl: val })
                } as any}
                label="Category Image"
            />
        </div>
      </div>

      <div className="flex flex-wrap gap-6 py-6 border-t border-b bg-slate-50/50 dark:bg-slate-950/20 -mx-1 px-4 rounded-xl">
          <div className="flex items-center space-x-3">
              <Switch checked={formData.isActive} onCheckedChange={(c) => setFormData({ ...formData, isActive: c })} className="data-checked:bg-green-500" />
              <label className="text-sm font-medium">Active</label>
          </div>
          <div className="flex items-center space-x-3">
              <Switch checked={formData.isFeatured} onCheckedChange={(c) => setFormData({ ...formData, isFeatured: c })} className="data-checked:bg-amber-500" />
              <label className="text-sm font-medium">Featured</label>
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
