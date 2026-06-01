"use client";

import { ImageUploadField } from '@/components/shared/form/image-upload-field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Plus, X } from 'lucide-react'
import { Category } from "@/services/category.service";

interface AddItemFormProps {
  formData: any;
  setFormData: (data: any) => void;
  categories: Category[];
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
  buttonText: string;
  onCancel: () => void;
}

export default function AddItemForm({
  formData,
  setFormData,
  categories,
  onSubmit,
  isPending,
  buttonText,
  onCancel,
}: AddItemFormProps) {
  const addGalleryImage = () => {
    setFormData({ ...formData, images: [...formData.images, ""] });
  };

  const removeGalleryImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const updateGalleryImage = (index: number, val: string) => {
    const newImages = [...formData.images];
    newImages[index] = val;
    setFormData({ ...formData, images: newImages });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto px-1 pr-3 scrollbar-hide">
      <div className="grid grid-cols-2 gap-6">
        {/* Core Info */}
        <div className="space-y-2 col-span-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Product Name <span className="text-red-500">*</span></label>
            <Input required placeholder="Crunchy Popcorn" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="rounded-xl border-slate-200 focus:border-orange-500" />
        </div>

        <div className="space-y-2 col-span-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Category <span className="text-red-500">*</span></label>
            <Select value={formData.categoryId} onValueChange={(v) => setFormData({ ...formData, categoryId: v })}>
                <SelectTrigger className="rounded-xl border-slate-200 w-full">
                    <SelectValue placeholder="Select a category">
                        {formData.categoryId && categories.find(c => c.id === formData.categoryId)?.name}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {categories.map((c: any) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Price (৳) <span className="text-red-500">*</span></label>
            <Input type="number" step="0.01" required placeholder="99.00" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value === '' ? '' : parseFloat(e.target.value) })} className="rounded-xl border-slate-200" />
        </div>

        <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Weight <span className="text-red-500">*</span></label>
            <Input required placeholder="e.g. 500g" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} className="rounded-xl border-slate-200" />
        </div>

        {/* Slug */}
        <div className="space-y-2 col-span-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Slug</label>
            <Textarea
                placeholder="crunchy-popcorn"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                rows={2}
                className="rounded-xl border-slate-200 resize-none h-20"
            />
        </div>

        {/* Description */}
        <div className="space-y-2 col-span-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Description</label>
            <Textarea 
                placeholder="Detailed snack description..." 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="rounded-xl border-slate-200"
            />
        </div>

        {/* Main Image */}
        <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-500">Primary Visuals</label>
            </div>
            <ImageUploadField
                field={{
                    name: "mainImage",
                    state: { value: formData.imageUrl, meta: { isTouched: false, errors: [] } },
                    handleChange: (val: string) => setFormData({ ...formData, imageUrl: val })
                } as any}
                label="Main Product Image"
            />
        </div>

        {/* Gallery Images */}
        <div className="col-span-2 space-y-4 pt-2">
            <div className="flex items-center justify-between border-b pb-2">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-500">Gallery Images</label>
                <Button type="button" variant="ghost" size="sm" onClick={addGalleryImage} className="h-8 text-primary hover:text-primary hover:bg-orange-50">
                    <Plus className="w-4 h-4 mr-1" /> Add Image
                </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
                {formData.images.map((img: string, index: number) => (
                    <div key={index} className="flex gap-4 items-end bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                         <div className="flex-1">
                            <ImageUploadField
                                field={{
                                    name: `image-${index}`,
                                    state: { value: img, meta: { isTouched: false, errors: [] } },
                                    handleChange: (val: string) => updateGalleryImage(index, val)
                                } as any}
                                label={`Gallery Image #${index + 1}`}
                                noLabel
                            />
                         </div>
                         <Button type="button" variant="outline" size="icon" onClick={() => removeGalleryImage(index)} className="shrink-0 text-destructive border-red-100 hover:bg-red-50 mb-1">
                            <X className="w-4 h-4" />
                         </Button>
                    </div>
                ))}
            </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 py-6 border-t border-b bg-slate-50/50 dark:bg-slate-950/20 -mx-1 px-4 rounded-xl">
          <div className="flex items-center space-x-3">
              <Switch checked={formData.isAvailable} onCheckedChange={(c) => setFormData({ ...formData, isAvailable: c })} className="data-checked:bg-green-500" />
              <label className="text-sm font-medium">Available for Order</label>
          </div>
          <div className="flex items-center space-x-3">
              <Switch checked={formData.isFeatured} onCheckedChange={(c) => setFormData({ ...formData, isFeatured: c })} className="data-checked:bg-amber-500" />
              <label className="text-sm font-medium">Feature on Homepage</label>
          </div>
          <div className="flex items-center space-x-3">
              <Switch checked={formData.isBestSelling} onCheckedChange={(c) => setFormData({ ...formData, isBestSelling: c })} className="data-checked:bg-purple-500" />
              <label className="text-sm font-medium text-purple-500 font-bold flex items-center gap-1">Best Selling 🔥</label>
          </div>
          <div className="flex items-center space-x-3">
              <Switch checked={formData.isSpicy} onCheckedChange={(c) => setFormData({ ...formData, isSpicy: c })} className="data-checked:bg-red-500" />
              <label className="text-sm font-medium  text-red-500 font-bold flex items-center gap-1">Spicy 🌶️</label>
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
