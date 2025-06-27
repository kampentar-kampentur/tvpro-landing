"use client"

import { useModalState, useModal } from "@/providers/ModalProvider";
import styles from "./BestQuoteModal.module.css";
import Modal from "@/ui/Modal";
import Form from "@/ui/Form"
import React, { useState } from "react";
import PriceSummary from "./components/PriceSummary";
import Button from "@/ui/Button";
import ObjectRenderer from "@/modals/BestQuoteModal/components/ObjDeb";


const example = {
    "steps": [
      {
        "id": "tv-size",
        "title": "What size is your TV?",
        "fields": [
          {
            "name": "tvSelection",
            "type": "checkboxWithCounter",
            "isRequired": true,
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
                "value": "60-80", 
                "label": "60\"-80\"", 
                "cost": 129,
              },
              { 
                "value": "over-81", 
                "label": "Over 81\"", 
                "cost": 149,
              },
              { 
                "value": "frameTv", 
                "label": "Frame TV", 
                "cost": 169,
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
            "label": "Select number of technicians for Over 81″",
            "showIf": {
              "field": "tvSelection",
              "condition": "hasAny",
              "values": ["over-81"]
            },
            "options": [
              { "value": "no", "label": "Over 81″ (1 tech + your help)", "cost": 0 },
              { "value": "yes", "label": "Over 81″ (2 techs, full service)", "cost": 59 },
            ]
          }
        ]
      },
      {
        "id": "mounting",
        "type": "dynamic",
        "title": "Mounting Type",
        "generateFrom": "tv-size.tvSelection",
        "template": {
          "subTitle": "Select mount type for {size} TV",
          "fields": [
            {
              "name": "mountType",
              "type": "radio",
              "isRequired": true,
              "showIf": {
                    "field": "$parentValue",
                    "condition": "equalsAny",
                    "values": ["over-81", "32-59", "upTo31", "60-80", "frameTv"]
                },
              "options": [
                { 
                  "value": "alreadyThere", 
                  "label": "Already there", 
                  "cost": 0,
                  "description": "TV stays in one position"
                },
                { 
                  "value": "fullMotion", 
                  "label": "Full-Motion Mount", 
                  "cost": 69,
                  "description": "TV can tilt up/down"
                },
                { 
                  "value": "fixed", 
                  "label": "Fixed Mount", 
                  "cost": 39,
                  "description": "TV can move in all directions"
                },
                { 
                  "value": "corner", 
                  "label": "Corner Mount", 
                  "cost": 69,
                  "description": "TV can tilt up/down"
                },
                { 
                  "value": "tilting", 
                  "label": "Tilting Mount", 
                  "cost": 49,
                  "description": "TV can move in all directions"
                },
              ]
            },
            {
              "name": "mountType",
              "type": "radio",
              "isRequired": true,
              "showIf": {
                    "field": "$parentValue",
                    "condition": "equalsAny",
                    "values": ["projectorsNScreens"]
                },
              "options": [
                { 
                  "value": "alreadyThere", 
                  "label": "Already there", 
                  "cost": 0,
                  "description": "TV stays in one position"
                },
              ]
            },
            {
              "name": "wallType",
              "type": "radio",
              "isRequired": true,
              "label": "What kind of wall will this TV be mounted on?",
              "showIf": {
                "field": "mountType",
                "condition": "equalsAny",
                "values": ['alreadyThere', 'fullMotion', 'fixed', 'corner', 'tilting']
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
              "showIf": {
                "field": "wallType",
                "condition": "equalsAny",
                "values": ['drywall']
              },
              "options": [
                { 
                  "value": "cableChannel", 
                  "label": "Cable channel", 
                  "cost": 39,
                  "description": "TV stays in one position"
                },
                { 
                  "value": "wall", 
                  "label": "Put it in the wall", 
                  "cost": 79,
                  "description": "TV stays in one position"
                },
                { 
                  "value": "socket", 
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
                "showIf": {
                  "field": "wallType",
                  "condition": "equalsAny",
                  "values": ['another']
                },
                "options": [
                  { 
                    "value": "cableChannel", 
                    "label": "Cable channel", 
                    "cost": 39,
                    "description": "TV stays in one position"
                  },
                  { 
                    "value": "wall", 
                    "label": "Put it in the wall", 
                    "cost": 199,
                    "description": "TV stays in one position"
                  },
                  { 
                    "value": "socket", 
                    "label": "In-wall with socket", 
                    "cost": 299,
                    "description": "TV stays in one position"
                  },
                ],
            },
          ]
        }
      },
      {
        "id": "additional-services",
        "title": "Additional Services",
        "fields": [
          {
            "name": "popular",
            "type": "checkboxWithCounter",
            "label": "The Most Popular",
            "options": [
                { 
                    "value": "soundbar", 
                    "label": "Install Soundbar", 
                    "cost": 59,
                },
                { 
                    "value": "wallShelf", 
                    "label": "Install Wall Shelf", 
                    "cost": 39,
                },
                { 
                    "value": "gamingConsole", 
                    "label": "Install Gaming Console", 
                    "cost": 59,
                },
                { 
                    "value": "rearSpeaker", 
                    "label": "Install Rear Speaker (2)", 
                    "cost": 49,
                },
            ]
          },
        ]
      },
      {
        "id": "contactInfo",
        "title": "Your contacts",
        "fields": [
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
          }
        ]
      }
    ],
    "priceCalculation": {
      "baseCost": 0,
      "dynamicCosts": [
        "tv-size.tvSelection",
        "tv-size.needHelper",
        "location.wallType",
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
  const [formData, setFormData] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [structuredCostBreakdown, setStructuredCostBreakdown] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e) {
    e?.preventDefault?.();
    setIsSubmitting(true);
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
        openModal('SeeYouSoon');
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

  return (
    <Modal isOpen={isOpen} onClose={close}>
        <div className={styles.bestQuote}>
            <aside className={styles.servicesContainer}>
                <div className={styles.banner}>
                    <p className={styles.saleText}>
                        Get $30 off when you book your TV mounting online
                    </p>
                    <p className={styles.saleSize}>
                        $30
                    </p>
                </div>
                <div className={styles.tempWrapp}>
                    <div className={styles.priceWrapper}>
                        <PriceSummary totalPrice={totalPrice} structuredCostBreakdown={structuredCostBreakdown} />
                    </div>
                    <div className={styles.footerSummary}>
                        <p>* Free TV dismount included with orders over $200</p>
                        <p>** Free Above-Fireplace TV Mounting</p>
                        <p className={styles.subSummaryText}>Prices shown are estimates. Final cost will be confirmed by your technician.</p>
                    </div>
                </div>
            </aside>
            <main className={styles.bestQuoteMain}>
                <Form scheme={example} value={formData} onChange={setFormData} onPriceChange={handlePriceChange} onSubmit={onSubmit}>
                  <Button type="submit" disabled={isSubmitting} className={styles.button}>
                    {isSubmitting ? 'Sending...' : 'Send'}
                  </Button>
                </Form>
            </main>
        </div>
    </Modal>
  );
};

export default BestQuoteModal; 