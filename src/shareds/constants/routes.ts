export const studentBase = '/student';
export const adminBase = '/admin';
export const wordsBase = '/words';
export const testsBase = '/student/tests';

export const student = {
  me: studentBase + '/me',
  register: studentBase + '/register',
  login: studentBase + '/login',
  update: studentBase + '/update',
  tests: testsBase,
};

export const admin = {
  me: adminBase + '/me',
  login: adminBase + '/login',
};

export const words = {
  random: '/random',
  create: '/create',
  update: '/update',
  delete: '/delete',
};
