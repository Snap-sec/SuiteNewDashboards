import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import appConfig from '../../../config/appConfig';

const InvisibleRecaptcha = forwardRef((props, ref) => {
  const recaptchaRef = useRef(null);

  useImperativeHandle(ref, () => ({
    async execute() {
      if (!recaptchaRef.current) return null;
      const token = await recaptchaRef.current.executeAsync();
      recaptchaRef.current.reset();
      return token;
    },
  }));

  return (
    <ReCAPTCHA
      ref={recaptchaRef}
      sitekey={appConfig.recaptchaSiteKey}
      size="invisible"
      badge="bottomright"
    />
  );
});

export default InvisibleRecaptcha;