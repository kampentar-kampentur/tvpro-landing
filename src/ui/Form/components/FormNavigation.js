import React from 'react';
import Button from '@/ui/Button';
import styles from './FormNavigation.module.css';
import Checkbox from '@/ui/Checkbox';

const FormNavigation = ({
  canGoBack,
  canGoForward,
  onPrevious,
  onNext,
  onSubmit,
  isLastStep,
  disableSubmitBtn
}) => {
  const TermsText = () => {
    return(
      <div style={{fontSize: '12px', maxWidth: "100%", textWrap: "wrap"}}>
        I agree to receive SMS from TVPro Handy Services LLC regarding appointments and service updates.
        <p>
          I give consent for TVPro Handy Services LLC to collect my contact details and text or email me concerning this request and future company updates, appointment reminders, and customer service communications. Messaging frequency varies based on requested service. Message and data rates may apply. I also agree to the Privacy Policy and Terms and Conditions, which can be found at the links below. Text &#34;STOP&#34; to cancel at any time.
        </p>
        <p>
          Message and data rates may apply. Max 4 messages/month. Text STOP to cancel. HELP for help.
        </p>
        <p>
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="sms-link">Privacy Policy</a> |
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="sms-link" style={{marginLeft: 8}}>Terms of Service</a>
        </p>
      </div>
    )
  }
  return (
    <>
      {isLastStep && 
        <div style={{maxWidth: "100%"}}>
          <Checkbox label={<TermsText/>}/>
        </div>  
      }
      <div className={styles.navigationButtons}>
        <Button 
          size='small'
          onClick={isLastStep ? onSubmit : onNext}
          type={isLastStep ? "submit" : "button"}
          disabled={!canGoForward || disableSubmitBtn}
        >
          {isLastStep ? "Next" : "Next"}
        </Button>
        {canGoBack && (
          <Button onClick={onPrevious} variant="secondary" size='small'>Back</Button>
        )}
      </div>
    </>
  );
};

export default FormNavigation;
