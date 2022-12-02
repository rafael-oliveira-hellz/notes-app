class Bundle {
  setBundle(request: any, { id, role }: any, bundleName: any) {
    if (bundleName) {
      request.session[bundleName] = {
        models: {
          id: id,
          role: role,
        },
      };
    } else {
      request.session.data = {
        models: {
          id: id,
          role: role,
        },
      };
    }
  }

  getBundle(request: any, bundleName: any) {
    if (bundleName) {
      const data = request.session['bundleName'];
      request.session.data = null;

      if (!data) {
        return {
          models: null,
          errors: null,
        };
      } else {
        return data;
      }
    } else {
      const data = request.session.data;
      request.session.data = null;

      if (!data) {
        return {
          models: null,
          errors: null,
        };
      } else {
        return data;
      }
    }
  }
}

export default new Bundle();
