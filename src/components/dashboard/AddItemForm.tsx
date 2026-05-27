"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ImageIcon, X } from "lucide-react";
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
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploadLoading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("image", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await response.json();

      if (data.url) {
        setFormData({
          ...formData,
          imageUrl: data.url,
          images: [...formData.images, data.url],
        });
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setImageUploadLoading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_: string, i: number) => i !== index);
    setFormData({
      ...formData,
      images: newImages,
      imageUrl: newImages[0] || "",
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Item Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter item name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight</Label>
          <Input
            id="weight"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            placeholder="e.g., 250g, 1pc"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="semiTitle">Semi Title</Label>
        <Input
          id="semiTitle"
          value={formData.semiTitle}
          onChange={(e) => setFormData({ ...formData, semiTitle: e.target.value })}
          placeholder="Short subtitle or tagline"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            placeholder="0.00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category">
                {formData.categoryId && categories.find(c => c.id === formData.categoryId)?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the item"
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Images</Label>
        <div className="border-2 border-dashed border-border rounded-lg p-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={imageUploadLoading}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors p-4"
          >
            <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground">
              {imageUploadLoading ? "Uploading..." : "Click to upload image"}
            </span>
          </label>
        </div>

        {formData.images.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-2">
            {formData.images.map((img: string, index: number) => (
              <div key={index} className="relative group">
                <img
                  src={img}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-20 object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />
          <Label htmlFor="isActive">Active</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isFeatured"
            checked={formData.isFeatured}
            onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
          />
          <Label htmlFor="isFeatured">Featured</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isSpicy"
            checked={formData.isSpicy}
            onCheckedChange={(checked) => setFormData({ ...formData, isSpicy: checked })}
          />
          <Label htmlFor="isSpicy">Spicy 🌶️</Label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : buttonText}
        </Button>
      </div>
    </form>
  );
}
