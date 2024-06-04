import { CollectionConfig } from 'payload/types';
import Quote from '../blocks/Quote';
import Content from '../blocks/Content';
import Alert from '../blocks/Alert';

const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Tin bài',
    plural: 'Tin bài',
  },
  admin: {
    defaultColumns: ['title', 'description'],
    useAsTitle: 'title',
    description: 'Trang quản lý tin bài',
    group: 'Trang quản trị',
  },
  access: {
    read: () => true,
  },

  // hooks: {
  //   beforeChange: [
  //     ({ data, originalDoc }) => {
  //       const now = new Date();

  //       // Nếu publishedDate nhỏ hơn hoặc bằng thời điểm hiện tại, status sẽ là 'published'
  //       if (data.publishedDate && new Date(data.publishedDate) <= now) {
  //         data.status = 'published';
  //       }
  //       // Nếu publishedDate lớn hơn thời điểm hiện tại, status sẽ là 'draft'
  //       else if (data.publishedDate && new Date(data.publishedDate) > now) {
  //         data.status = 'draft';
  //       }
  //       return data;
  //     },
  //   ],
  // },

  fields: [
    {
      name: 'title',
      label: 'Tiêu đề',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Mô tả',
      type: 'textarea',
      required: true,
    },
    {
      name: 'keywords',
      label: 'Từ khóa',
      type: 'text',
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Thêm ảnh tin bài',
          fields: [
            {
              name: 'postImages',
              label: 'Tải ảnh lên',
              type: 'array',
              minRows: 1,
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Nội dung tin bài',
          fields: [
            {
              name: 'layout',
              label: 'Nội dung',
              type: 'blocks',
              blocks: [Quote, Content, Alert],
            },
          ],
        },
      ],
    },
    // add sidebar fields here
    {
      name: 'representImage',
      label: 'Ảnh Thumbnail',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      label: 'Trạng thái',
      type: 'select',
      required: true,
      options: [
        {
          value: 'draft',
          label: 'Draft',
        },
        {
          value: 'published',
          label: 'Published',
        },
      ],
      defaultValue: 'published',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedDate',
      label: 'Ngày đăng',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
        date: {
          displayFormat: 'dd/MM/yyyy',
        },
        condition: (data, originalDoc) => data.status == 'published',
      },
    },
    {
      name: 'author',
      label: 'Tác giả',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
    },
  ],
};
export default Posts;
