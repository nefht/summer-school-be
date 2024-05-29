import { CollectionConfig } from 'payload/types';
import { slateEditor } from '@payloadcms/richtext-slate';

const Course: CollectionConfig = {
  slug: 'course',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Tên khóa học',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Mô tả khóa học',
      type: 'richText',
      required: true,
    },

    {
      name: 'courseImages',
      label: 'Thêm ảnh khóa học',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'parts',
      label: 'Bài học',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'partTitle',
          label: 'Tên bài học',
          type: 'text',
          required: true,
        },
        {
          name: 'partDescription',
          label: 'Mô tả bài học',
          type: 'richText',
          required: true,
          editor: slateEditor({
            admin: {
              elements: [
                // customize elements allowed in Slate editor here
                'blockquote',
                'link',
                'ol',
                'ul',
                'textAlign',
                'indent',
              ],
              leaves: [
                // customize leaves allowed in Slate editor here
                'bold',
                'code',
                'italic',
                'strikethrough',
                'underline',
              ],
            },
          }),
        },
        {
          name: 'partImage',
          label: 'Đăng ảnh bài học',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    //Side bar
    {
      name: 'registrationTime',
      label: 'Thời gian đăng ký',
      type: 'group',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'registrationStartDate',
          label: 'Thời gian bắt đầu',
          type: 'date',
          required: true,
        },
        {
          name: 'registrationEndDate',
          label: 'Thời gian kết thúc',
          type: 'date',
          required: true,
        },
      ],
    },
  ],
};

export default Course;
