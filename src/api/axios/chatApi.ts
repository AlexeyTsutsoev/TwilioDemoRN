import myAxios from './axios';

const path = '/token';

export const getTwilioToken = async (
  name: string,
): Promise<string | undefined> => {
  try {
    console.log('name from axios--->', name);

    const user = await myAxios.get(`${path}`, {
      params: {
        id: name,
      },
    });
    return user.data.jwt;
  } catch (err) {
    console.log('err from axios');
    console.log(err);
  }
};
