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
      type: 'text',
    },
    {
      name: 'description',
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
