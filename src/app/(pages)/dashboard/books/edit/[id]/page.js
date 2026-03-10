"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { ArrowLeft, Loader2, Save, Upload, X } from "lucide-react";

export default function EditBookPage() {
  const { id } = useParams();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm();

  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState(null);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState([]);

  // Fetch Book
  useEffect(() => {
    fetch(`/api/books/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBook(data.data);
          reset(data.data);
          setImagePreview(data.data.images || []);
        } else {
          setError("Book not found");
        }
      })
      .catch(() => setError("Failed to load book"))
      .finally(() => setLoading(false));
  }, [id, reset]);

  // Remove Image
  const removeImage = (index) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  // Upload Preview
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const previews = files.map(file => ({
      url: URL.createObjectURL(file),
      file
    }));

    setImagePreview(prev => [...prev, ...previews]);
  };

  // Submit
  const onSubmit = async (formData) => {
    try {
      const payload = {
        ...formData,
        images: imagePreview
      };

      const res = await fetch(`/api/books/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (!result.success) {
        alert(result.message || "Update failed");
        return;
      }

      alert("Book updated successfully");
      router.push("/dashboard/books");

    } catch {
      alert("Something went wrong");
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT SIDE (STICKY FORM) */}
        <div className="lg:col-span-2">
          <div className="sticky top-6 h-fit max-h-[calc(100vh-3rem)] overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 mb-6 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={18} />
                Back
              </button>

              <h1 className="text-2xl font-bold mb-6">Edit Book</h1>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Title */}
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <input
                    {...register("title", { required: true })}
                    className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">Title is required</p>
                  )}
                </div>

                {/* Author */}
                <div>
                  <label className="text-sm font-medium">Author</label>
                  <input
                    {...register("author")}
                    className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <input
                    {...register("category")}
                    className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                {/* Price */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register("price")}
                      className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Original Price</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register("originalPrice")}
                      className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Discount %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      {...register("discount")}
                      className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                {/* Stock */}
                <div>
                  <label className="text-sm font-medium">Stock</label>
                  <input
                    type="number"
                    min="0"
                    {...register("stock")}
                    className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    rows={4}
                    {...register("description")}
                    className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Update Book
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (SCROLLABLE IMAGES) */}
        <div className="space-y-6 lg:col-span-1">
          {/* Images Section */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4 flex items-center justify-between">
              Book Images
              <span className="text-sm font-normal text-gray-500">
                ({imagePreview.length} images)
              </span>
            </h2>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {imagePreview.map((img, index) => (
                <div
                  key={index}
                  className="relative border rounded-lg overflow-hidden group"
                >
                  <div className="relative w-full h-48">
                    <Image
                      src={img.url || img}
                      fill
                      className="object-cover"
                      alt={`Book image ${index + 1}`}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                    title="Remove image"
                  >
                    <X size={16} />
                  </button>

                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-lg">
                      Primary Cover
                    </span>
                  )}
                </div>
              ))}

              {imagePreview.length === 0 && (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                  No images uploaded yet
                </div>
              )}
            </div>

            {/* Upload Button */}
            <label className="mt-6 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 p-4 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition group">
              <Upload size={18} className="text-gray-500 group-hover:text-blue-500" />
              <span className="text-gray-600 group-hover:text-blue-500">Upload Images</span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {/* Stats Preview */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-lg">
            <h3 className="font-semibold mb-4 text-gray-800">Preview Stats</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-blue-100">
                <span className="text-gray-600">Price</span>
                <span className="font-bold text-lg text-blue-600">
                  ${parseFloat(watch("price") || 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-blue-100">
                <span className="text-gray-600">Discount</span>
                <span className="font-bold text-lg text-green-600">
                  {watch("discount") || 0}%
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Stock</span>
                <span className={`font-bold text-lg ${parseInt(watch("stock")) < 10 ? 'text-red-500' : 'text-gray-700'}`}>
                  {watch("stock") || 0} units
                </span>
              </div>

              {parseInt(watch("discount")) > 0 && (
                <div className="mt-4 p-3 bg-green-100 rounded-lg">
                  <p className="text-sm text-green-700">
                    Final price: ${(parseFloat(watch("price") || 0) * (1 - (parseFloat(watch("discount") || 0) / 100))).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}