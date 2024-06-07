import { CollectionConfig } from 'payload/types';

const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Ảnh',
    plural: 'Ảnh',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Trang quản trị',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      label: 'Văn bản thay thế',
      type: 'text',
    },
    {
      name: 'description',
      label: 'Tên hình ảnh',
      type: 'text',
    },
  ],
  upload: {
    staticURL: '/media',
    staticDir: 'media',
    mimeTypes: ['image/*'],
  },
};
export default Media;
