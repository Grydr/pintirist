// resources/js/Pages/Pins/Create.tsx
import { Head, Link, useForm } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { useEffect, useState } from 'react';
import { dashboard } from '@/routes';
import { store, create } from '@/routes/pins';

type FormData = {
  title: string;
  description: string;
  link?: string | null;
  image: File | null;
};

export default function CreatePin() {
  const { data, setData, post, processing, errors, progress, reset } = useForm<FormData>({
    title: '',
    description: '',
    link: '',
    image: null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  useEffect(() => {
    if (data.image) {
      const url = URL.createObjectURL(data.image);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [data.image]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(store.url(), {
      forceFormData: true,
      onSuccess: () => reset('title','description','link','image'),
    });
  };

  return (
    <AppSidebarLayout
      breadcrumbs={[{ title: 'Create Pin', href: create.url() }]} // ⬅️ pinsCreate.url()
    >
      <Head title="Create Pin" />

      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Create a Pin</h1>

        <form onSubmit={onSubmit} encType="multipart/form-data" className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Image *</label>
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="rounded-xl max-h-96 object-contain mb-3" />
            ) : (
              <div className="rounded-xl border border-dashed p-6 text-center text-sm text-neutral-500 mb-3">
                No image selected
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setData('image', e.target.files?.[0] ?? null)}
              className='button bg-gray-200 rounded-xl w-[15rem] text-center'
              required
            />
            {errors.image && <p className="text-sm text-red-600 mt-1">{errors.image}</p>}
            {progress && (
              <div className="w-full bg-neutral-200 h-2 rounded mt-2">
                <div className="h-2 bg-black rounded" style={{ width: `${progress.percentage}%` }} />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              className="w-full rounded-lg border px-3 py-2"
              value={data.title}
              onChange={(e) => setData('title', e.target.value)}
              maxLength={120}
              required
            />
            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full rounded-lg border px-3 py-2"
              rows={5}
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              maxLength={1000}
            />
            {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
          </div>

          <div className="flex gap-3">
            <Link href={dashboard.url()} className="px-4 py-2 rounded-lg border hover:bg-neutral-50">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50"
            >
              {processing ? 'Uploading…' : 'Publish'}
            </button>
          </div>
        </form>
      </div>
    </AppSidebarLayout>
  );
}
