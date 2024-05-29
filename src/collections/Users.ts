import { CollectionConfig } from 'payload/types';

const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    cookies: {
      secure: process.env.PAYLOAD_ENV !== 'development',
      sameSite: process.env.PAYLOAD_ENV === 'testing' ? 'none' : 'lax',
    },
  },
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'name',
      label: 'Họ và tên',
      type: 'text',
      required: true,
    },
  ],
};

export default Users;
