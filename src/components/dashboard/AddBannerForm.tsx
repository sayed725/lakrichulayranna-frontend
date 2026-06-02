"use client";

import { ImageUploadField } from '@/components/shared/form/image-upload-field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '@/services/category.service'

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
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories({ limit: 100 }),
  });
  const categories = categoriesData?.data || [];

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto px-1 pr-3 scrollbar-hide">
      <div className="grid grid-cols-2 gap-6">
        {/* Title */}
        <div className="space-y-2 col-span-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Banner Title</label>
            <Input placeholder="e.g., Summer Sale" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="rounded-xl border-slate-200 focus:border-orange-500" />
        </div>

        {/* Subtitle */}
        <div className="space-y-2 col-span-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Subtitle</label>
            <Input placeholder="e.g., Up to 50% off" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="rounded-xl border-slate-200 focus:border-orange-500" />
        </div>

        {/* Badge */}
        <div className="space-y-2 col-span-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Badge</label>
            <Input placeholder="e.g., New, Sale, Limited" value={formData.badge} onChange={(e) => setFormData({ ...formData, badge: e.target.value })} className="rounded-xl border-slate-200 focus:border-orange-500" />
        </div>

        {/* Button Text */}
        <div className="space-y-2 col-span-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Button Text</label>
            <Input placeholder="e.g., Shop Now, Learn More" value={formData.buttonText} onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })} className="rounded-xl border-slate-200 focus:border-orange-500" />
        </div>

        {/* Category */}
        <div className="space-y-2 col-span-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Category<span className='ml-1 text-red-500'>*</span></label>
            <Select value={formData.categoryId} onValueChange={(v) => setFormData({ ...formData, categoryId: v })}>
              <SelectTrigger className="rounded-xl border-slate-200 focus:border-orange-500 w-full">
                <SelectValue placeholder="Select category">
                  {formData.categoryId ? categories.find((cat: any) => cat.id === formData.categoryId)?.name : "Select category"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat: any) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>

        {/* Order */}
        <div className="space-y-2 col-span-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Display Order</label>
            <Input type="number" placeholder="1" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} className="rounded-xl border-slate-200 focus:border-orange-500" />
        </div>

        {/* Image */}
        <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-500">Banner Image<span className='ml-1 text-red-500'>*</span></label>
            </div>
            <ImageUploadField
                field={{
                    name: "image",
                    state: { value: formData.image, meta: { isTouched: false, errors: [] } },
                    handleChange: (val: string) => setFormData({ ...formData, image: val })
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
          <div className="flex items-center space-x-3">
              <Switch checked={formData.banner} onCheckedChange={(c) => setFormData({ ...formData, banner: c })} className="data-checked:bg-amber-500" />
              <label className="text-sm font-medium">Banner</label>
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
