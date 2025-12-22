"use client"

import { useModalState, useModal } from "@/providers/ModalProvider";
import styles from "./BestQuoteModal.module.css";
import Modal from "@/ui/Modal";
import Form from "@/ui/Form"
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import PriceSummary from "./components/PriceSummary";
import LogoSVG  from "@/assets/logo.svg"
import CloseIcon from "@/assets/icons/close.svg"
import ChevronIcon from "@/assets/icons/chevron.svg"
import Button from "@/ui/Button"

const example = {
    "steps": [
      {
        "id": "tv-size",
        "title": "TV Size",
        "fields": [
          {
            "name": "tvSelection",
            "type": "radio",
            "isRequired": true,
            "label": "Choose TV size",
            "options": [
              { 
                  "value": "upTo31", 
                  "label": "Up to 31\"", 
                  "cost": 69,
              },
              { 
                "value": "32-59", 
                "label": "32\"-59\"", 
                "cost": 119,
              },
              {
                "value": "60-75", 
                "label": "60\"-75\"", 
                "cost": 139,
              },
              { 
                "value": "76-85", 
                "label": "76\"-85\"", 
                "cost": 149,
              },
              { 
                "value": "over-86", 
                "label": "Over 86\"", 
                "cost": 179,
              },
              { 
                "value": "frameTvUpTo60", 
                "label": "Frame TV", 
                "subtitle": "Up to 60″",
                "cost": 159,
              },
              { 
                "value": "frameTvOver65", 
                "label": "Frame TV", 
                "subtitle": "Over 65″",
                "cost": 179,
              },
              {
                "value": "projectorsNScreens",
                "label": "Projectors & Screens",
                "cost": 169,
                "costLabel": "From $169"
              },
            ]
          },
          {
            "name": "extraTechnicans",
            "type": "radio",
            "label": "Number of Technicians for Over 61″",
            "isRequired": true,
            "showIf": {
              "field": "tvSelection",
              "condition": "equalsAny",
              "values": ["over-86", "60-75", "76-85", "frameTvUpTo60", "frameTvOver65", "projectorsNScreens"]
            },
            "options": [
              { "value": "no", "label": "1 Tech", "cost": 0, "costLabel": "+$0", "subtitle": "+ your help", "description": "One technician will handle the entire installation. Your assistance will be needed only at the very end — for a couple of minutes — to help lift and hang the TV onto the mount." },
              { "value": "yes", "label": "2 Tech", "cost": 59, "costLabel": "+$59", "subtitle": "Full service", "description": "Two professional technicians will complete the entire installation from start to finish — no help required. Sit back and enjoy a fully managed, hassle-free service." },
            ]
          }
        ]
      },
      {
        "id": "mounting",
        "title": "Mount Type",
        "fields": [
          {
            "name": "mountType",
            "type": "radio",
            "isRequired": true,
            "label": "Choose mount type",
            "options": [
              { 
                "value": "alreadyThere", 
                "label": "Already there", 
                "cost": 0,
                "costLabel": "+$0",
                "description": "Already have your own mount? Perfect! We’ll safely install your TV on your existing bracket at no extra cost."
              },
              { 
                "value": "fixed", 
                "label": "Fixed Mount",
                "subtitle": "1.5” from wall",
                "cost": 39,
                "costLabel": "+$39",
                "description": "Clean and reliable: keeps your TV close to the wall for a sleek, modern look"
              },
              { 
                "value": "tilting", 
                "label": "Tilt Mount", 
                "subtitle": "up to 15° tilt",
                "cost": 49,
                "costLabel": "+$49",
                "description": "Adjust the vertical angle to reduce glare and get the perfect view from any seating position."
              },
              { 
                "value": "corner", 
                "label": "Corner Mount", 
                "subtitle": "fits TVs up to 75”",
                "cost": 69,
                "costLabel": "+$69",
                "description": "the ideal solution for corner setups: saves space while keeping your room stylish and functional."
              },
              { 
                "value": "fullMotion", 
                "label": "Full-Motion Mount", 
                "subtitle": "extends up to 15”",
                "cost": 69,
                "costLabel": "+$69",
                "description": "maximum flexibility: pull, swivel, and tilt your TV to enjoy the best viewing angle anywhere in the room."
              },
              { 
                "value": "ceilingMount", 
                "label": "Ceiling Mount", 
                "subtitle": "",
                "cost": 69,
                "costLabel": "+$69",
                "description": "a unique option when walls are occupied or for a bold interior design: mount your TV directly to the ceiling."
              },
            ]
          },
        ]
      },
      {
        "id": "wall",
        "title": "Wall Type",
        "fields": [
          {
            "name": "wallType",
            "type": "radio",
            "isRequired": true,
            "label": "Choose wall type",
            "options": [
              {
                "value": "drywall",
                "label": "Drywall",
                "cost": 0,
                "costLabel": "+$0",
                "description": "standard wall type, quick and simple installation."
              },
              {
                "value": "brick",
                "label": "Brick",
                "cost": 49,
                "costLabel": "+$49",
                "description": "strong and durable surface, requires special tools and anchors for a secure mount."
              },
              {
                "value": "concrete",
                "label": "Concrete",
                "cost": 49,
                "costLabel": "+$49",
                "description": "heavy-duty material that ensures a solid and lasting installation."
              },
              {
                "value": "tile",
                "label": "Other",
                "cost": 49,
                "costLabel": "+$49",
                "description": "perfect for kitchens, bathrooms, or decorative walls. We use diamond drill bits to carefully protect your tiles while ensuring a safe and reliable mount."
              },
            ],
          },
          {
            "name": "wires",
            "type": "radio",
            "isRequired": true,
            "label": "Do you want to hide the wires?",
            "description": "*For hidden wires we cut two openings — one behind the TV and another near the power outlet — to neatly hide the power cable inside the wall. To complete the look, we install sleek white cover plates for a clean and seamless finish.",
            "showIf": {
              "all": [
                {
                  "field": "wallType",
                  "condition": "equalsAny",
                  "values": ['drywall']
                },
              ]
            },
            "options": [
              { 
                "value": "open", 
                "label": "Exposed", 
                "subtitle": "no extra charge",
                "cost": 0,
                "costLabel": "+$0",
                "description": "standard setup with visible wires, quick and simple."
              },
              { 
                "value": "cableChannelDrywall", 
                "label": "Cable Channel", 
                "cost": 39,
                "costLabel": "+$39",
                "description": "a sleek plastic channel to neatly hide and organize wires along the wall."
              },
              { 
                "value": "wallDrywall", 
                "label": "Put it in the Wall", 
                "cost": 79,
                "costLabel": "+$79",
                "description": "professional in-wall cable concealment: wires run behind the wall with clean cover plates for a seamless look."
              },
              { 
                "value": "socketDrywall", 
                "label": "In-Wall with Socket", 
                "cost": 99,
                "costLabel": "+$99",
                "description": "premium solution: full in-wall cable concealment plus a recessed power outlet for the cleanest, most professional finish."
              },
            ],
          },
          {
              "name": "wires",
              "type": "radio",
              "isRequired": true,
              "label": "Do you want to hide the wires?",
              "description": "*For hidden wires we cut two openings — one behind the TV and another near the power outlet — to neatly hide the power cable inside the wall. To complete the look, we install sleek white cover plates for a clean and seamless finish.",
              "showIf": {
                "all": [
                  {
                    "field": "wallType",
                    "condition": "equalsAny",
                    "values": ['another', 'brick', 'concrete', 'tile']
                  },
                ]
              },
              "options": [
                { 
                    "value": "open",
                    "label": "Exposed",
                    "subtitle": "no extra charge",
                    "cost": 0,
                    "costLabel": "+$0",
                    "description": "visible wires, fast and simple setup."
                },
                { 
                  "value": "cableChannelBrick", 
                  "label": "Cable channel", 
                  "cost": 39,
                  "costLabel": "+$39",
                  "description": "neat surface channel to keep cables organized on brick, concrete, or tile."
                },
                { 
                  "value": "wallBrick", 
                  "label": "In-Wall Concealment", 
                  "cost": 199,
                  "costLabel": "+$199",
                  "description": "we cut the surface with a diamond grinder, hide the cables, add a brush plate, and seal edges with silicone for a clean finish."
                },
                { 
                  "value": "socketBrick", 
                  "label": "In-Wall with Socket", 
                  "cost": 229,
                  "costLabel": "+$229",
                  "description": "premium option: full in-wall concealment plus recessed power outlet, finished with brush plates and silicone detailing."
                },
              ],
          },
        ],
      },
      {
        "id": "contactInfo",
        "title": "Address",
        "fields": [

          {
            "name": "temp",
            "type": "radio",
            "label": "Service Address",
            "options": []
          },
          {
            "name": "name",
            "type": "text",
            "textLabel": "Enter your name",
            "placeholder": "Enter your name *",
            "isRequired": true
          },
          {
            "name": "phone",
            "type": "tel",
            "textLabel": "Enter your phone",
            "placeholder": "Enter your number *",
            "isRequired": true
          },
          {
            "name": "address",
            "type": "text",
            "textLabel": "Enter your address",
            "placeholder": "Address",
          },
          {
            "name": "zipApt",
            "type": "splited",
            "textLabel": "Enter your zip code and apartment/unit",
            "fields": [
              {
                "name": "zip",
                "type": "text",
                "placeholder": "Zip Code *",
                "isRequired": true,
                "minLength": 5,
                "maxLength": 5
              },
              {
                "name": "apt",
                "type": "text",
                "placeholder": "Apt/Unit",
                "isRequired": false
              }
            ]
          },
        ]
      }
    ],
    "priceCalculation": {
      "baseCost": 0,
      "dynamicCosts": [
        "tv-size.tvSelection",
        "tv-size.needHelper",
        "mounting.*.wallType",
        "mounting.*.mountType",
        "mounting.*.cableManagement",
        "mounting.*.powerOutlet",
        "additional-services.soundbar",
        "additional-services.soundbarType",
        "additional-services.streaming",
        "scheduling.timeSlot",
        "scheduling.urgentInstall"
      ]
    }
   }

const BestQuoteModal = () => {
  const {isOpen, close} = useModalState('BestQuote');
  const { openModal } = useModal();
  const router = useRouter();
  const [formData, setFormData] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [structuredCostBreakdown, setStructuredCostBreakdown] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPriceExpanded, setIsPriceExpanded] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isFormValid = !!(formData.contactInfo?.name && formData.contactInfo?.phone && formData.contactInfo?.zipApt?.zip);

  useEffect(() => {
    if(!isOpen) {
        setFormData({})
    }
  }, [isOpen])
  async function onSubmit(e) {
    e?.preventDefault?.();
    setIsSubmitting(true);
    console.log("formData", formData);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_SRTAPI_URL || 'http://localhost:1337';
      debugger
      const response = await fetch(`${apiUrl}/api/best-quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          data: {
            ...formData,
            contactInfo: {
              ...formData.contactInfo,
              zip: formData.contactInfo.zipApt.zip,
              apt: formData.contactInfo.zipApt.apt
            }
          }
        }),
      });
      if (response.ok) {
        // Store pricing data in localStorage with timestamp
        const pricingData = {
          totalPrice,
          structuredCostBreakdown,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('pricingData', JSON.stringify(pricingData));

        close();
        setFormData({});
        if (typeof gtag !== 'undefined') {
          gtag('event', 'conversion', {'send_to': 'AW-17416148778/aAZCCNeF9vsaEKqu1fBA'});
        }
        router.push('/booking-success');
      } else {
        const errorData = await response.json();
        console.error('Form submission error:', errorData);
        alert('An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Failed to send form:', error);
      alert('Failed to send request. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handlePriceChange = (newTotalPrice, newStructuredCostBreakdown) => {
    setTotalPrice(newTotalPrice);
    setStructuredCostBreakdown(newStructuredCostBreakdown);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Modal className={styles.bestQuoteModalcontent} isOpen={isOpen} onClose={close}>
      <header className={styles.bestQuoteHeader}>
        <LogoSVG
          width="82" 
          height="40"
          role="img"
        />
      </header>
        <div className={styles.bestQuote}>
            {/* Mobile price summary - visible on small screens */}
            {totalPrice > 0 &&
              <div className={styles.mobilePriceSummary}>
                  <div
                    className={styles.mobilePriceHeader + (currentStepIndex === 3 ? ' ' + styles.center : '')}
                    onClick={() => setIsPriceExpanded(!isPriceExpanded)}
                  >
                    <span className={styles.mobilePriceLabel}>{currentStepIndex === 3 ? "Go to Book" : "View Order"}</span>
                    <span className={styles.mobilePriceAmount}>{formatCurrency(totalPrice)}</span>
                  </div>
                  {isPriceExpanded && (
                    <div className={styles.mobilePriceExpanded}>
                      <div className={styles.expandedHeader}>
                        <Button variant="secondary" size="small" className={styles.closeButton} onClick={() => setIsPriceExpanded(false)}>
                          <CloseIcon width="10" heigth="10"/>
                        </Button>
                      </div>
                      <div className={styles.orderInfo}>
                        <p className={styles.orderTitle}>Your order</p>
                        <p className={styles.orderItem}>FREE Above-Fireplace TV Installation</p>
                        <p className={styles.orderDisclaimer}>Prices shown are estimates. Final cost will be confirmed by your technician.</p>
                        <hr className={styles.orderDivider} />
                      </div>
                      <div className={styles.priceWrapper}>
                        <PriceSummary totalPrice={totalPrice} structuredCostBreakdown={structuredCostBreakdown} currentStepIndex={currentStepIndex} isFormValid={isFormValid} isSubmitting={isSubmitting} onSubmit={onSubmit} darkMode={true} />
                      </div>
                    </div>
                  )}
              </div>
            }
            <main className={styles.bestQuoteMain}>
                <Form
                  scheme={example}
                  value={formData}
                  onChange={setFormData}
                  onPriceChange={handlePriceChange}
                  onSubmit={onSubmit}
                  onStepChange={setCurrentStepIndex}
                  disableSubmitBtn={isSubmitting}
                  isMobile={isMobile}
                  currentStepIndex={currentStepIndex}
                  onClose={close}
                />
                <div className={styles.space}></div>
                {(isMobile && currentStepIndex === 0) ||
                  <div className={styles.discountBanner}>
                      <p className={styles.discountLabel}>Installing 2 or more TVs?</p>
                      <p className={styles.discountText}>Let the manager know to receive a multi-TVs <span className={styles.discountWord}>DISCOUNT</span>: <span className={styles.discountPercent}>10% OFF</span> for 2 TVs, <span className={styles.discountPercent}>15% OFF</span> for 3, <span className={styles.discountPercent}>20% OFF</span> for 4 or more.</p>
                  </div>
                }
            </main>
            <aside className={styles.servicesContainer}>
                <div className={styles.banner}>
                    <p className={styles.saleText}>
                      Enjoy an instant <b>$30 OFF</b>
                    </p>
                    <p className={styles.saleText}>
                      when you place your online order over $200
                    </p>
                    <p className={styles.saleSize}>
                        $30 OFF
                    </p>
                </div>
                <div className={styles.orderInfo}>
                    <p className={styles.orderTitle}>Your order</p>
                    <p className={styles.orderItem}>FREE Above-Fireplace TV Installation</p>
                    <p className={styles.orderDisclaimer}>Prices shown are estimates. Final cost will be confirmed by your technician.</p>
                    <hr className={styles.orderDivider} />
                </div>
                <div className={styles.tempWrapp}>
                    <div className={styles.priceWrapper}>
                        <PriceSummary totalPrice={totalPrice} structuredCostBreakdown={structuredCostBreakdown} currentStepIndex={currentStepIndex} isFormValid={isFormValid} isSubmitting={isSubmitting} onSubmit={onSubmit} />
                    </div>
                    {/* <div className={styles.footerSummary}>
                        <p>* Free TV dismount included with orders over $200</p>
                        <p>** Free Above-Fireplace TV Mounting</p>
                        <p className={styles.subSummaryText}>Prices shown are estimates. Final cost will be confirmed by your technician.</p>
                    </div> */}
                </div>
            </aside>
        </div>
    </Modal>
  );
};

export default BestQuoteModal; 
