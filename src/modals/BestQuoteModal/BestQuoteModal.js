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
                "cost": 109,
              },
              {
                "value": "60-75", 
                "label": "60\"-75\"", 
                "cost": 129,
              },
              { 
                "value": "76-85", 
                "label": "76\"-85\"", 
                "cost": 149,
              },
              { 
                "value": "over-86", 
                "label": "Over 86\"", 
                "cost": 169,
              },
              { 
                "value": "frameTvUpTo60", 
                "label": "Frame TV up to 60 inch", 
                "cost": 159,
              },
              { 
                "value": "frameTvOver65", 
                "label": "Frame TV over 65 inch", 
                "cost": 179,
              },
              {
                "value": "projectorsNScreens",
                "label": "Projectors & Screens",
                "cost": 139,
              },
            ]
          },
          {
            "name": "extraTechnicans",
            "type": "radio",
            "label": "Select number of technicians for Over 61″",
            "isRequired": true,
            "showIf": {
              "field": "tvSelection",
              "condition": "equalsAny",
              "values": ["over-86", "60-75", "76-85", "frameTvUpTo60", "frameTvOver65", "projectorsNScreens"]
            },
            "options": [
              { "value": "no", "label": "Over 61″ (1 tech + your help)", "cost": 0 },
              { "value": "yes", "label": "Over 61″ (2 techs, full service)", "cost": 59 },
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
            // "showIf": {
            //       "field": "$parentValue",
            //       "condition": "equalsAny",
            //       "values": [
            //           "over-86",
            //           "32-59",
            //           "upTo31",
            //           "60-75",
            //           "76-85",
            //       ]
            //   },
            "options": [
              { 
                "value": "alreadyThere", 
                "label": "Already there", 
                "cost": 0,
                "description": "TV stays in one position"
              },
              { 
                "value": "fixed", 
                "label": "Fixed Mount", 
                "cost": 39,
                "description": "TV can move in all directions"
              },
              { 
                "value": "tilting", 
                "label": "Tilting Mount", 
                "cost": 49,
                "description": "TV can move in all directions"
              },
              { 
                "value": "corner", 
                "label": "Corner Mount", 
                "cost": 69,
                "description": "TV can tilt up/down"
              },
              { 
                "value": "fullMotion", 
                "label": "Full-Motion Mount", 
                "cost": 69,
                "description": "TV can tilt up/down"
              },
            ]
          },
          // {
          //   "name": "mountType",
          //   "type": "radio",
          //   "isRequired": true,
          //   "showIf": {
          //         "field": "$parentValue",
          //         "condition": "equalsAny",
          //         "values": ["projectorsNScreens"]
          //     },
          //   "options": [
          //     { 
          //       "value": "alreadyThere", 
          //       "label": "Already there", 
          //       "cost": 0,
          //       "description": "TV stays in one position"
          //     },
          //   ]
          // },
          // {
          //   "name": "wallType",
          //   "type": "radio",
          //   "isRequired": true,
          //   "label": "What kind of wall will this TV be mounted on?",
          //   "showIf": {
          //     "any": [
          //       {
          //         "field": "mountType",
          //         "condition": "equalsAny",
          //         "values": ['alreadyThere', 'fullMotion', 'fixed', 'corner', 'tilting']
          //       },
          //       {
          //         "field": "$parentValue",
          //         "condition": "equalsAny",
          //         "values": ["frameTvUpTo60", "frameTvOver65"]
          //       }
          //     ]
          //   },
          //   "options": [
          //     { 
          //       "value": "drywall", 
          //       "label": "Drywall", 
          //       "cost": 0,
          //       "description": "TV stays in one position"
          //     },
          //     { 
          //       "value": "another", 
          //       "label": "Brick, Concrete, Tile, Stone", 
          //       "cost": 49,
          //       "description": "TV stays in one position"
          //     },
          //   ],
          // },
          // {
          //   "name": "wires",
          //   "type": "radio",
          //   "isRequired": true,
          //   "label": "Do you want to hide the wires?",
          //   "showIf": {
          //     "all": [
          //       {
          //         "field": "wallType",
          //         "condition": "equalsAny",
          //         "values": ['drywall']
          //       },
          //       {
          //         "field": "$parentValue",
          //         "condition": "notEquals",
          //         "value": "frameTvUpTo60"
          //         },
          //         {
          //           "field": "$parentValue",
          //           "condition": "notEquals",
          //           "value": "frameTvOver65"
          //         },
          //     ]
          //   },
          //   "options": [
          //     { 
          //       "value": "open", 
          //       "label": "Open", 
          //       "cost": 0,
          //       "description": "TV stays in one position"
          //     },
          //     { 
          //       "value": "cableChannelDrywall", 
          //       "label": "Cable channel", 
          //       "cost": 39,
          //       "description": "TV stays in one position"
          //     },
          //     { 
          //       "value": "wallDrywall", 
          //       "label": "Put it in the wall", 
          //       "cost": 79,
          //       "description": "TV stays in one position"
          //     },
          //     { 
          //       "value": "socketDrywall", 
          //       "label": "In-wall with socket", 
          //       "cost": 99,
          //       "description": "TV stays in one position"
          //     },
          //   ],
          // },
          // {
          //     "name": "wires",
          //     "type": "radio",
          //     "isRequired": true,
          //     "label": "Do you want to hide the wires?",
          //     "showIf": {
          //       "all": [
          //         {
          //           "field": "wallType",
          //           "condition": "equalsAny",
          //           "values": ['another']
          //         },
          //         {
          //           "field": "$parentValue",
          //           "condition": "notEquals",
          //           "value": "frameTvUpTo60"
          //         },
          //         {
          //           "field": "$parentValue",
          //           "condition": "notEquals",
          //           "value": "frameTvOver65"
          //         },
          //       ]
          //     },
          //     "options": [
          //       { 
          //           "value": "open", 
          //           "label": "Open", 
          //           "cost": 0,
          //           "description": "TV stays in one position"
          //       },
          //       { 
          //         "value": "cableChannelBrick", 
          //         "label": "Cable channel", 
          //         "cost": 39,
          //         "description": "TV stays in one position"
          //       },
          //       { 
          //         "value": "wallBrick", 
          //         "label": "Put it in the wall", 
          //         "cost": 199,
          //         "description": "TV stays in one position"
          //       },
          //       { 
          //         "value": "socketBrick", 
          //         "label": "In-wall with socket", 
          //         "cost": 229,
          //         "description": "TV stays in one position"
          //       },
          //     ],
          // },
          // {
          //   "name": "wires",
          //   "type": "radio",
          //   "isRequired": true,
          //   "label": "Do you want to hide the wires?",
          //   "showIf": {
          //     "all": [
          //       {
          //         "field": "wallType",
          //         "condition": "equalsAny",
          //         "values": ['drywall']
          //       },
          //       {
          //         "field": "$parentValue",
          //         "condition": "equalsAny",
          //         "values": ["frameTvUpTo60", "frameTvOver65"]
          //       },
          //     ]
          //   },
          //   "options": [
          //     { 
          //       "value": "open", 
          //       "label": "Open", 
          //       "cost": 0,
          //       "description": "TV stays in one position"
          //     },
          //     { 
          //       "value": "wallDrywall", 
          //       "label": "Put it in the wall", 
          //       "cost": 79,
          //       "description": "TV stays in one position"
          //     },
          //     { 
          //       "value": "boxSocketDrywall", 
          //       "label": "Recessed box with socket", 
          //       "cost": 99,
          //       "description": "TV stays in one position"
          //     },
          //   ],
          // },
          // {
          //     "name": "wires",
          //     "type": "radio",
          //     "isRequired": true,
          //     "label": "Do you want to hide the wires?",
          //     "showIf": {
          //       "all": [
          //         {
          //           "field": "wallType",
          //           "condition": "equalsAny",
          //           "values": ['another']
          //         },
          //         {
          //           "field": "$parentValue",
          //           "condition": "equalsAny",
          //           "values": ["frameTvUpTo60", "frameTvOver65"]
          //         },
          //       ]
          //     },
          //     "options": [
          //       { 
          //           "value": "open", 
          //           "label": "Open", 
          //           "cost": 0,
          //           "description": "TV stays in one position"
          //       },
          //       { 
          //         "value": "wallBrick", 
          //         "label": "Put it in the wall", 
          //         "cost": 199,
          //         "description": "TV stays in one position"
          //       },
          //       { 
          //         "value": "boxSocketBrick", 
          //         "label": "Recessed box with socket", 
          //         "cost": 229,
          //         "description": "TV stays in one position"
          //       },
          //     ],
          // },
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
            "showIf": {
              "any": [
                {
                  "field": "mounting.mountType",
                  "condition": "equalsAny",
                  "values": ['alreadyThere', 'fullMotion', 'fixed', 'corner', 'tilting']
                },
                {
                  "field": "tv-size.tvSelection",
                  "condition": "equalsAny",
                  "values": ["frameTvUpTo60", "frameTvOver65"]
                }
              ]
            },
            "options": [
              {
                "value": "drywall",
                "label": "Drywall",
                "cost": 0,
                "description": "TV stays in one position"
              },
              {
                "value": "another",
                "label": "Brick, Concrete, Tile, Stone",
                "cost": 49,
                "description": "TV stays in one position"
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
                {
                  "field": "tv-size.tvSelection",
                  "condition": "notEquals",
                  "value": "frameTvUpTo60"
                  },
                {
                  "field": "tv-size.tvSelection",
                  "condition": "notEquals",
                  "value": "frameTvOver65"
                },
              ]
            },
            "options": [
              { 
                "value": "open", 
                "label": "Open", 
                "cost": 0,
                "description": "TV stays in one position"
              },
              { 
                "value": "cableChannelDrywall", 
                "label": "Cable channel", 
                "cost": 39,
                "description": "TV stays in one position"
              },
              { 
                "value": "wallDrywall", 
                "label": "Put it in the wall", 
                "cost": 79,
                "description": "TV stays in one position"
              },
              { 
                "value": "socketDrywall", 
                "label": "In-wall with socket", 
                "cost": 99,
                "description": "TV stays in one position"
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
                    "values": ['another']
                  },
                  {
                    "field": "tv-size.tvSelection",
                    "condition": "notEquals",
                    "value": "frameTvUpTo60"
                  },
                  {
                    "field": "tv-size.tvSelection",
                    "condition": "notEquals",
                    "value": "frameTvOver65"
                  },
                ]
              },
              "options": [
                { 
                    "value": "open", 
                    "label": "Open", 
                    "cost": 0,
                    "description": "TV stays in one position"
                },
                { 
                  "value": "cableChannelBrick", 
                  "label": "Cable channel", 
                  "cost": 39,
                  "description": "TV stays in one position"
                },
                { 
                  "value": "wallBrick", 
                  "label": "Put it in the wall", 
                  "cost": 199,
                  "description": "TV stays in one position"
                },
                { 
                  "value": "socketBrick", 
                  "label": "In-wall with socket", 
                  "cost": 229,
                  "description": "TV stays in one position"
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
                {
                  "field": "tv-size.tvSelection",
                  "condition": "equalsAny",
                  "values": ["frameTvUpTo60", "frameTvOver65"]
                },
              ]
            },
            "options": [
              { 
                "value": "open", 
                "label": "Open", 
                "cost": 0,
                "description": "TV stays in one position"
              },
              { 
                "value": "wallDrywall", 
                "label": "Put it in the wall", 
                "cost": 79,
                "description": "TV stays in one position"
              },
              { 
                "value": "boxSocketDrywall", 
                "label": "Recessed box with socket", 
                "cost": 99,
                "description": "TV stays in one position"
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
                    "values": ['another']
                  },
                  {
                    "field": "tv-size.tvSelection",
                    "condition": "equalsAny",
                    "values": ["frameTvUpTo60", "frameTvOver65"]
                  },
                ]
              },
              "options": [
                { 
                    "value": "open", 
                    "label": "Open", 
                    "cost": 0,
                    "description": "TV stays in one position"
                },
                { 
                  "value": "wallBrick", 
                  "label": "Put it in the wall", 
                  "cost": 199,
                  "description": "TV stays in one position"
                },
                { 
                  "value": "boxSocketBrick", 
                  "label": "Recessed box with socket", 
                  "cost": 229,
                  "description": "TV stays in one position"
                },
              ],
          },
        ]
      },
      // {
      //   "id": "additional-services",
      //   "title": "Additional Services",
      //   "fields": [
      //     {
      //       "name": "popular",
      //       "type": "radio",
      //       "label": "The Most Popular",
      //       "options": [
      //           {
      //               "value": "soundbar",
      //               "label": "Install Soundbar",
      //               "cost": 59,
      //           },
      //           {
      //               "value": "wallShelf",
      //               "label": "Install Wall Shelf",
      //               "cost": 39,
      //           },
      //           {
      //               "value": "gamingConsole",
      //               "label": "Install Gaming Console",
      //               "cost": 59,
      //           },
      //           { 
      //               "value": "rearSpeaker", 
      //               "label": "Install Rear Speaker (2)", 
      //               "cost": 49,
      //           },
      //       ]
      //     },
      //     {
      //       "name": "extraInstallation",
      //       "type": "radio",
      //       "label": "Extra Installation",
      //       "options": [
      //           {
      //               "value": "installLEDLight",
      //               "label": "Install LED Light",
      //               "cost": 29,
      //           },
      //           { 
      //               "value": "installFireplace", 
      //               "label": "Install Fireplace", 
      //               "cost": 79,
      //           },
      //           {
      //               "value": "dismountExistingTV",
      //               "label": "Dismount existing TV",
      //               "cost": 35,
      //           },
      //           { 
      //               "value": "installOfCurtains", 
      //               "label": "Install curtains", 
      //               "cost": 59,
      //           },
      //           {
      //               "value": "installPaintingsAndDecor",
      //               "label": "Install paintings & decor",
      //               "cost": 35,
      //           },
      //           { 
      //               "value": "installInWallSpeaker", 
      //               "label": "Install In-Wall Speaker", 
      //               "cost": 69,
      //           },
      //       ]
      //     },
      //     {
      //       "name": "mounts",
      //       "type": "radio",
      //       "label": "Mounts",
      //       "options": [
      //           {
      //               "value": "X-BoxMount",
      //               "label": "X-Box Mount",
      //               "cost": 39,
      //           },
      //           {
      //               "value": "PlayStationMount",
      //               "label": "PlayStation Mount",
      //               "cost": 39,
      //           },
      //           { 
      //               "value": "soundbarMount", 
      //               "label": "Soundbar Mount", 
      //               "cost": 19,
      //           },
      //       ]
      //     },
      //     {
      //       "name": "cables",
      //       "type": "radio",
      //       "label": "Cables",
      //       "options": [
      //           {
      //               "value": "HDMI10ft",
      //               "label": "HDMI 10ft",
      //               "cost": 14,
      //           },
      //           {
      //               "value": "HDMI15ft",
      //               "label": "HDMI 15ft",
      //               "cost": 18,
      //           },
      //           { 
      //               "value": "extensionCord6ft", 
      //               "label": "Extension Cord 6ft", 
      //               "cost": 6,
      //           },
      //           {
      //               "value": "powerCordForTV",
      //               "label": "Power Cord for TV",
      //               "cost": 15,
      //           },
      //       ]
      //     },
      //   ]
      // },
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
            "placeholder": "Your name *",
            "isRequired": true
          },
          {
            "name": "phone",
            "type": "tel",
            "textLabel": "Enter your phone",
            "placeholder": "Phone number *",
            "isRequired": true
          },
          {
            "name": "zip",
            "type": "number",
            "textLabel": "Enter your zip code",
            "placeholder": "Zip Code *",
            "isRequired": true,
            "minLength": 5,
            "maxLength": 5
          },
          {
            "name": "address",
            "type": "text",
            "textLabel": "Enter your address",
            "placeholder": "Address",
          },
          {
            "name": "email",
            "type": "text",
            "textLabel": "Enter your email address ",
            "placeholder": "Email address",
          }
          
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
    const checkMobile = () => setIsMobile(window.innerWidth <= 980);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isFormValid = !!(formData.contactInfo?.name && formData.contactInfo?.phone && formData.contactInfo?.zip);

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
      const response = await fetch(`${apiUrl}/api/best-quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: formData }),
      });
      if (response.ok) {
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
            {currentStepIndex > 0 &&
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
                        <PriceSummary totalPrice={totalPrice} structuredCostBreakdown={structuredCostBreakdown} currentStepIndex={currentStepIndex} isFormValid={isFormValid} onSubmit={onSubmit} darkMode={true} />
                      </div>
                    </div>
                  )}
              </div>
            }
            <main className={styles.bestQuoteMain}>
                <Form scheme={example} value={formData} onChange={setFormData} onPriceChange={handlePriceChange} onSubmit={onSubmit} onStepChange={setCurrentStepIndex} disableSubmitBtn={isSubmitting} isMobile={isMobile} currentStepIndex={currentStepIndex} onClose={close}>
                </Form>
                <div style={{flexGrow: 1}}></div>
                {(isMobile && currentStepIndex === 0) ||
                  <div className={styles.discountBanner}>
                      <p className={styles.discountLabel}>Installing 2 or more TVs?</p>
                      <p className={styles.discountText}>Let the manager know to receive a multi-TVs <span className={styles.discountPercent}>DISCOUNT</span>: <span className={styles.discountPercent}>10% OFF</span> for 2 TVs, <span className={styles.discountPercent}>15% OFF</span> for 3, <span className={styles.discountPercent}>20% OFF</span> for 4 or more.</p>
                  </div>
                }
            </main>
            <aside className={styles.servicesContainer}>
                <div className={styles.banner}>
                    <p className={styles.saleText}>
                      Enjoy an instant $30 OFF
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
                        <PriceSummary totalPrice={totalPrice} structuredCostBreakdown={structuredCostBreakdown} currentStepIndex={currentStepIndex} isFormValid={isFormValid} onSubmit={onSubmit} />
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
