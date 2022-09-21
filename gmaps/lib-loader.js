const loader = {
  loaded: false,
  readyPromises: [],

  /**
   * @param apiKey    API Key, or object with the URL parameters. For example
   *                  to use Google Maps Premium API, pass
   *                    `{ client: <YOUR-CLIENT-ID> }`.
   *                  You may pass the libraries and/or version (as `v`) parameter into
   *                  this parameter and skip the next two parameters
   * @param version   Google for Maps version
   * @param libraries Libraries to load (@see
   *                  https://developers.google.com/maps/documentation/javascript/libraries)
   * @param language  Lang code
   * @param region    Region
   *                  (@see https://developers.google.com/maps/documentation/javascript/localization)
   */
  load({ apiKey, version, libraries, language, region }) {
    if (typeof window === "undefined") {
      // Do nothing if run from server-side
      return Promise.resolve();
    }
    if (!this.loaded && (!window.google || !window.google.maps)) {
      const googleMapScript = document.createElement("SCRIPT");

      // Allow apiKey to be an object.
      // This is to support more esoteric means of loading Google Maps,
      // such as Google for business
      // https://developers.google.com/maps/documentation/javascript/get-api-key#premium-auth
      const options = {};
      if (typeof apiKey === "string") {
        options.key = apiKey;
      } else if (typeof apiKey === "object") {
        for (let k in apiKey) {
          // transfer values in apiKey to options
          options[k] = apiKey[k];
        }
      } else {
        throw new Error("`apiKey` should either be a string or an object");
      }

      // libraries
      let librariesPath = "";
      if (libraries && libraries.length > 0) {
        librariesPath = libraries.join(",");
        options["libraries"] = librariesPath;
      } else if (options.libraries instanceof Array) {
        options.libraries = options.libraries.join(",");
      }
      options["callback"] = "VueGoogleMapsLoaded";

      let baseUrl = "https://maps.googleapis.com/";

      let url =
        baseUrl +
        "maps/api/js?" +
        Object.keys(options)
          .map(
            (key) =>
              encodeURIComponent(key) + "=" + encodeURIComponent(options[key])
          )
          .join("&");

      if (version) {
        url = url + "&v=" + version;
      }

      if (language) {
        url = url + "&language=" + language;
      }

      if (region) {
        url = url + "&region=" + region;
      }

      googleMapScript.setAttribute("src", url);
      googleMapScript.setAttribute("async", "");
      googleMapScript.setAttribute("defer", "");
      document.body.appendChild(googleMapScript);

      window.VueGoogleMapsLoaded = this._setLoaded.bind(this);
    } else {
      this._setLoaded();
    }
  },

  ensureReady() {
    if (this.loaded) {
      return Promise.resolve();
    } else {
      return new Promise((resolve) => {
        this.readyPromises.push(resolve);
      });
    }
  },

  _setLoaded() {
    this.loaded = true;
    for (let i = 0; i < this.readyPromises.length; i++) {
      this.readyPromises[i]();
    }
    this.readyPromises = [];
  },
};

export default loader;
