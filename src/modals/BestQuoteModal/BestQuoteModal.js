"use client";

import { useModalState, useModal } from "@/providers/ModalProvider";
import styles from "./BestQuoteModal.module.css";
import Modal from "@/ui/Modal";
import Form from "@/ui/Form";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import PriceSummary from "./components/PriceSummary";
import LogoSVG from "@/assets/logo.svg";
import ChevronIcon from "@/assets/icons/chevron.svg";
import Button from "@/ui/Button";
import { validatePhone } from "@/ui/Form/utils/phoneValidation";
import { getUtmParams } from "@/lib/utmTracker";
import Link from "next/link";

const BestQuoteScheme = {
  steps: [
    {
      id: "tv-size",
      title: "TV Size",
      fields: [
        {
          name: "tvSelection",
          type: "radio",
          isRequired: true,
          label: "Choose TV size",
          options: [
            {
              value: "upTo31",
              label: 'Up to 31"',
              cost: 69,
            },
            {
              value: "32-59",
              label: '32"-59"',
              cost: 125,
            },
            {
              value: "60-69",
              label: '60"-69"',
              cost: 144,
            },
            {
              value: "70-85",
              label: '70"-85"',
              cost: 149,
            },
            {
              value: "over-86",
              label: 'Over 86"',
              cost: 189,
            },
            {
              value: "frameTvUpTo60",
              label: "Frame TV",
              subtitle: "Up to 60″",
              cost: 174,
            },
            {
              value: "frameTvOver65",
              label: "Frame TV",
              subtitle: "Over 65″",
              cost: 184,
            },
            {
              value: "projectorsNScreens",
              label: "Projectors",
              cost: 189,
              costLabel: "From $189",
            },
          ],
        },
        {
          name: "extraTechnicans",
          type: "radio",
          label: "Number of Technicians for Over 61″",
          isRequired: true,
          showIf: {
            field: "tvSelection",
            condition: "equalsAny",
            values: [
              "over-86",
              "60-69",
              "70-85",
              "frameTvUpTo60",
              "frameTvOver65",
              "projectorsNScreens",
            ],
          },
          options: [
            {
              value: "no",
              label: "1 Tech",
              cost: 0,
              costLabel: "+$0",
              subtitle: "+ your help",
              description:
                "One technician will handle the entire installation. Your assistance will be needed only at the very end — for a couple of minutes — to help lift and hang the TV onto the mount.",
            },
            {
              value: "yes",
              label: "2 Tech",
              cost: 59,
              costLabel: "+$59",
              subtitle: "Full service",
              description:
                "Two professional technicians will complete the entire installation from start to finish — no help required. Sit back and enjoy a fully managed, hassle-free service.",
            },
          ],
        },
      ],
    },
    {
      id: "mounting",
      title: "Mount Type",
      showIf: {
        field: "tv-size.tvSelection",
        condition: "notEqualsAny",
        values: ["frameTvUpTo60", "frameTvOver65", "projectorsNScreens"],
      },
      fields: [
        {
          name: "mountType",
          type: "radio",
          isRequired: true,
          label: "Choose mount type",
          options: [
            {
              value: "alreadyThere",
              label: "Already there",
              cost: 0,
              costLabel: "+$0",
              description:
                "Already have your own mount? Perfect! We’ll safely install your TV on your existing bracket at no extra cost.",
            },
            {
              value: "fixed",
              label: "Fixed Mount",
              subtitle: "1.5” from wall",
              cost: 44,
              costLabel: "+$44",
              description:
                "Clean and reliable: keeps your TV close to the wall for a sleek, modern look",
            },
            {
              value: "tilting",
              label: "Tilt Mount",
              subtitle: "up to 15° tilt",
              cost: 52,
              costLabel: "+$52",
              description:
                "Adjust the vertical angle to reduce glare and get the perfect view from any seating position.",
            },
            {
              value: "fullMotion",
              label: "Full-Motion Mount",
              subtitle: "extends up to 15”",
              cost: 69,
              costLabel: "+$69",
              description:
                "maximum flexibility: pull, swivel, and tilt your TV to enjoy the best viewing angle anywhere in the room.",
            },
            {
              value: "corner",
              label: "Corner Mount",
              subtitle: "fits TVs up to 75”",
              cost: 69,
              costLabel: "+$69",
              description:
                "the ideal solution for corner setups: saves space while keeping your room stylish and functional.",
            },
            {
              value: "ceilingMount",
              label: "Ceiling Mount",
              subtitle: "",
              cost: 69,
              costLabel: "+$69",
              description:
                "a unique option when walls are occupied or for a bold interior design: mount your TV directly to the ceiling.",
            },
            {
              value: "ultraSlim",
              label: "Ultra Slim 0.3",
              subtitle: "ultra thin profile",
              cost: 79,
              costLabel: "+$79",
              description:
                "ultra low profile mount: keeps the TV extremely close to the wall for a picture-frame effect.",
            },
          ],
        },
      ],
    },
    {
      id: "wall",
      title: "Wall Type",
      fields: [
        {
          name: "wallType",
          type: "radio",
          isRequired: true,
          label: "Choose wall type",
          showIf: {
            field: "tv-size.tvSelection",
            condition: "notEqualsAny",
            values: ["projectorsNScreens"],
          },
          options: [
            {
              value: "drywall",
              label: "Drywall",
              cost: 0,
              costLabel: "+$0",
              description: "standard wall type, quick and simple installation.",
            },
            {
              value: "decorAccent",
              label: "Accent Wall",
              cost: 30,
              costLabel: "+$30",
              description:
                "decorative accent wall requiring extra care and precise mounting.",
            },
            {
              value: "metalStuds",
              label: "Metal Studs",
              cost: 30,
              costLabel: "+$30",
              description:
                "metal framing studs requiring specialized hardware for safe installation.",
            },
            {
              value: "stoneBrickConcrete",
              label: "Stone / Brick / Concrete",
              cost: 49,
              costLabel: "+$49",
              description:
                "strong and durable surface, requires special tools and anchors for a secure mount.",
            },
            {
              value: "tile",
              label: "Tile",
              cost: 69,
              costLabel: "+$69",
              description:
                "perfect for kitchens, bathrooms, or decorative walls. We use diamond drill bits to carefully protect your tiles while ensuring a safe and reliable mount.",
            },
            {
              value: "ceiling",
              label: "Ceiling",
              cost: 39,
              costLabel: "+$39",
              description: "mounting directly onto a ceiling structure.",
            },
          ],
        },
        {
          name: "wallTypeProjector",
          type: "radio",
          isRequired: true,
          label: "Choose wall type",
          showIf: {
            field: "tv-size.tvSelection",
            condition: "equals",
            value: "projectorsNScreens",
          },
          options: [
            {
              value: "drywall",
              label: "Drywall",
              cost: 0,
              costLabel: "+$0",
              description: "standard wall type, quick and simple installation.",
            },
            {
              value: "metalStuds",
              label: "Metal Studs",
              cost: 30,
              costLabel: "+$30",
              description:
                "metal framing studs requiring specialized hardware for safe installation.",
            },
            {
              value: "stoneBrickConcrete",
              label: "Stone / Brick / Concrete",
              cost: 49,
              costLabel: "+$49",
              description:
                "strong and durable surface, requires special tools and anchors for a secure mount.",
            },
          ],
        },
        {
          name: "fireplace",
          type: "radio",
          isRequired: true,
          label: "Mounting above a fireplace?",
          showIf: {
            field: "wallType",
            condition: "equalsAny",
            values: [
              "drywall",
              "decorAccent",
              "metalStuds",
              "stoneBrickConcrete",
              "tile",
            ],
          },
          options: [
            {
              value: "yes",
              label: "Yes",
              breakdownLabel: "Above Fireplace",
              cost: 32,
              costLabel: "+$32",
              description: "Above Fireplace installation.",
            },
            {
              value: "no",
              label: "No",
              hideFromBreakdown: true,
              cost: 0,
              costLabel: "+$0",
            },
          ],
        },
        // Wires: Drywall / Accent Wall / Metal Studs + Regular TV + NOT above fireplace
        {
          name: "wires",
          type: "radio",
          isRequired: true,
          label: "Do you want to hide the wires?",
          description:
            "*For hidden wires we cut two openings — one behind the TV and another near the power outlet — to neatly hide the power cable inside the wall. To complete the look, we install sleek white cover plates for a clean and seamless finish.",
          showIf: {
            all: [
              {
                field: "tv-size.tvSelection",
                condition: "notEqualsAny",
                values: ["frameTvUpTo60", "frameTvOver65"],
              },
              {
                any: [
                  {
                    all: [
                      {
                        field: "wallType",
                        condition: "equalsAny",
                        values: ["drywall", "decorAccent", "metalStuds"],
                      },
                      {
                        field: "fireplace",
                        condition: "equals",
                        value: "no",
                      },
                    ],
                  },
                  {
                    field: "wallTypeProjector",
                    condition: "equalsAny",
                    values: ["drywall", "metalStuds"],
                  },
                ],
              },
            ],
          },
          options: [
            {
              value: "open",
              label: "Exposed",
              subtitle: "no extra charge",
              cost: 0,
              costLabel: "+$0",
              description:
                "standard setup with visible wires, quick and simple.",
            },
            {
              value: "cableChannelDrywall",
              label: "Cable Channel",
              cost: 43,
              costLabel: "+$43",
              description:
                "a sleek plastic channel to neatly hide and organize wires along the wall.",
            },
            {
              value: "wallDrywall",
              label: "Put it in the wall",
              cost: 93,
              costLabel: "+$93",
              description:
                "professional in-wall cable concealment: wires run behind the wall with clean cover plates for a seamless look.",
            },
            {
              value: "socketDrywall",
              label: "In wall with socket",
              cost: 129,
              costLabel: "+$129",
              description:
                "premium solution: full in-wall cable concealment plus a recessed power outlet for the cleanest, most professional finish.",
            },
          ],
        },
        // Wires: Drywall / Accent Wall / Metal Studs + Frame TV + NOT above fireplace
        {
          name: "wires",
          type: "radio",
          isRequired: true,
          label: "Do you want to hide the wires?",
          description:
            "*For hidden wires we cut two openings — one behind the TV and another near the power outlet — to neatly hide the power cable inside the wall. To complete the look, we install sleek white cover plates for a clean and seamless finish.",
          showIf: {
            all: [
              {
                field: "wallType",
                condition: "equalsAny",
                values: ["drywall", "decorAccent", "metalStuds"],
              },
              {
                field: "tv-size.tvSelection",
                condition: "equalsAny",
                values: ["frameTvUpTo60", "frameTvOver65"],
              },
              {
                field: "fireplace",
                condition: "equals",
                value: "no",
              },
            ],
          },
          options: [
            {
              value: "open",
              label: "Exposed",
              subtitle: "no extra charge",
              cost: 0,
              costLabel: "+$0",
              description:
                "standard setup with visible wires, quick and simple.",
            },
            {
              value: "cableChannelDrywall",
              label: "Cable Channel",
              cost: 43,
              costLabel: "+$43",
              description:
                "a sleek plastic channel to neatly hide and organize wires along the wall.",
            },
            {
              value: "wallDrywall",
              label: "Put it in the wall",
              cost: 93,
              costLabel: "+$93",
              description:
                "professional in-wall cable concealment: wires run behind the wall with clean cover plates for a seamless look.",
            },
            {
              value: "socketDrywall",
              label: "Recessed box Installation",
              cost: 149,
              costLabel: "+$149",
              description:
                "premium solution: full in-wall cable concealment plus a recessed power outlet for the cleanest, most professional finish.",
            },
          ],
        },
        // Wires: Drywall / Accent Wall / Metal Studs + Regular TV + ABOVE fireplace
        {
          name: "wires",
          type: "radio",
          isRequired: true,
          label: "Do you want to hide the wires?",
          description:
            "*For hidden wires we cut two openings — one behind the TV and another near the power outlet — to neatly hide the power cable inside the wall.",
          showIf: {
            all: [
              {
                field: "wallType",
                condition: "equalsAny",
                values: ["drywall", "decorAccent", "metalStuds"],
              },
              {
                field: "tv-size.tvSelection",
                condition: "notEqualsAny",
                values: ["frameTvUpTo60", "frameTvOver65"],
              },
              {
                field: "fireplace",
                condition: "equals",
                value: "yes",
              },
            ],
          },
          options: [
            {
              value: "open",
              label: "Exposed",
              subtitle: "no extra charge",
              cost: 0,
              costLabel: "+$0",
              description:
                "standard setup with visible wires, quick and simple.",
            },
            {
              value: "cableChannelDrywall",
              label: "Cable Channel",
              cost: 43,
              costLabel: "+$43",
              description:
                "a sleek plastic channel to neatly hide and organize wires along the wall.",
            },
            {
              value: "wallFireplace",
              label: "In-Wall Concealment",
              cost: 109,
              costLabel: "+$109",
              description:
                "wires run behind the wall with clean cover plates for a seamless look.",
            },
            {
              value: "socketFireplace",
              label: "In Wall with Socket",
              cost: 149,
              costLabel: "+$149",
              description:
                "premium solution: full in-wall cable concealment plus a recessed power outlet for the cleanest, most professional finish.",
            },
          ],
        },
        // Wires: Drywall / Accent Wall / Metal Studs + Frame TV + ABOVE fireplace
        {
          name: "wires",
          type: "radio",
          isRequired: true,
          label: "Do you want to hide the wires?",
          description:
            "*For hidden wires we cut two openings — one behind the TV and another near the power outlet — to neatly hide the power cable inside the wall.",
          showIf: {
            all: [
              {
                field: "wallType",
                condition: "equalsAny",
                values: ["drywall", "decorAccent", "metalStuds"],
              },
              {
                field: "tv-size.tvSelection",
                condition: "equalsAny",
                values: ["frameTvUpTo60", "frameTvOver65"],
              },
              {
                field: "fireplace",
                condition: "equals",
                value: "yes",
              },
            ],
          },
          options: [
            {
              value: "open",
              label: "Exposed",
              subtitle: "no extra charge",
              cost: 0,
              costLabel: "+$0",
              description:
                "standard setup with visible wires, quick and simple.",
            },
            {
              value: "cableChannelDrywall",
              label: "Cable Channel",
              cost: 43,
              costLabel: "+$43",
              description:
                "a sleek plastic channel to neatly hide and organize wires along the wall.",
            },
            {
              value: "wallFireplace",
              label: "Put it in the wall",
              cost: 109,
              costLabel: "+$109",
              description:
                "wires run behind the wall with clean cover plates for a seamless look.",
            },
            {
              value: "socketFireplace",
              label: "Recessed box Installation",
              cost: 149,
              costLabel: "+$149",
              description:
                "premium solution: full in-wall cable concealment plus a recessed power outlet for the cleanest, most professional finish.",
            },
          ],
        },
        // Wires: Hard Surface (Stone/Brick/Concrete, Tile, Ceiling) + Regular TV
        {
          name: "wires",
          type: "radio",
          isRequired: true,
          label: "Do you want to hide the wires?",
          description:
            "*For hidden wires we cut two openings — one behind the TV and another near the power outlet — to neatly hide the power cable inside the wall. To complete the look, we install sleek white cover plates for a clean and seamless finish.",
          showIf: {
            all: [
              {
                field: "tv-size.tvSelection",
                condition: "notEqualsAny",
                values: ["frameTvUpTo60", "frameTvOver65"],
              },
              {
                any: [
                  {
                    field: "wallType",
                    condition: "equals",
                    value: "ceiling",
                  },
                  {
                    all: [
                      {
                        field: "wallType",
                        condition: "equalsAny",
                        values: ["stoneBrickConcrete", "tile"],
                      },
                      {
                        field: "fireplace",
                        condition: "equalsAny",
                        values: ["yes", "no"],
                      },
                    ],
                  },
                  {
                    field: "wallTypeProjector",
                    condition: "equals",
                    value: "stoneBrickConcrete",
                  },
                ],
              },
            ],
          },
          options: [
            {
              value: "open",
              label: "Exposed",
              subtitle: "no extra charge",
              cost: 0,
              costLabel: "+$0",
              description: "visible wires, fast and simple setup.",
            },
            {
              value: "cableChannelBrick",
              label: "Cable channel",
              cost: 52,
              costLabel: "+$52",
              description:
                "neat surface channel to keep cables organized on brick, concrete, or tile.",
            },
            {
              value: "wallBrick",
              label: "In-Wall Concealment",
              cost: 249,
              costLabel: "+$249",
              description:
                "we cut the surface with a diamond grinder, hide the cables, add a brush plate, and seal edges with silicone for a clean finish.",
            },
            {
              value: "socketBrick",
              label: "In-Wall with Socket",
              cost: 289,
              costLabel: "+$289",
              description:
                "premium option: full in-wall concealment plus recessed power outlet, finished with brush plates and silicone detailing.",
            },
          ],
        },
        // Wires: Hard Surface (Stone/Brick/Concrete, Tile, Ceiling) + Frame TV
        {
          name: "wires",
          type: "radio",
          isRequired: true,
          label: "Do you want to hide the wires?",
          description:
            "*For hidden wires we cut two openings — one behind the TV and another near the power outlet — to neatly hide the power cable inside the wall. To complete the look, we install sleek white cover plates for a clean and seamless finish.",
          showIf: {
            all: [
              {
                field: "tv-size.tvSelection",
                condition: "equalsAny",
                values: ["frameTvUpTo60", "frameTvOver65"],
              },
              {
                any: [
                  {
                    field: "wallType",
                    condition: "equals",
                    value: "ceiling",
                  },
                  {
                    all: [
                      {
                        field: "wallType",
                        condition: "equalsAny",
                        values: ["stoneBrickConcrete", "tile"],
                      },
                      {
                        field: "fireplace",
                        condition: "equalsAny",
                        values: ["yes", "no"],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          options: [
            {
              value: "open",
              label: "Exposed",
              subtitle: "no extra charge",
              cost: 0,
              costLabel: "+$0",
              description: "visible wires, fast and simple setup.",
            },
            {
              value: "cableChannelBrick",
              label: "Cable channel",
              cost: 52,
              costLabel: "+$52",
              description:
                "neat surface channel to keep cables organized on brick, concrete, or tile.",
            },
            {
              value: "wallBrick",
              label: "Put it in the wall",
              cost: 249,
              costLabel: "+$249",
              description:
                "we cut the surface with a diamond grinder, hide the cables, add a brush plate, and seal edges with silicone for a clean finish.",
            },
            {
              value: "socketBrick",
              label: "Recessed box Installation",
              cost: 289,
              costLabel: "+$289",
              description:
                "premium option: full in-wall concealment plus recessed power outlet, finished with brush plates and silicone detailing.",
            },
          ],
        },
      ],
    },
    {
      id: "additionalServices",
      title: "Additional Services",
      fields: [
        {
          name: "soundbar",
          type: "radio",
          isRequired: true,
          label: "Do you need Soundbar Installation?",
          showIf: {
            field: "tv-size.tvSelection",
            condition: "notEqualsAny",
            values: ["projectorsNScreens"],
          },
          options: [
            {
              value: "no",
              label: "No",
              hideFromBreakdown: true,
              cost: 0,
              costLabel: "+$0",
            },
            {
              value: "yes",
              label: "Yes",
              breakdownLabel: "Soundbar Installation",
              cost: 69,
              costLabel: "+$69",
              description: "Professional soundbar mounting and setup.",
            },
          ],
        },
        {
          name: "soundbarMount",
          type: "radio",
          isRequired: true,
          label: "Choose soundbar mount type",
          showIf: {
            all: [
              {
                field: "soundbar",
                condition: "equals",
                value: "yes",
              },
              {
                field: "tv-size.tvSelection",
                condition: "notEqualsAny",
                values: ["projectorsNScreens"],
              },
            ],
          },
          options: [
            {
              value: "alreadyThere",
              label: "Already there / Not required",
              cost: 0,
              costLabel: "+$0",
            },
            {
              value: "wallMount",
              label: "Soundbar Wall Mount",
              cost: 19,
              costLabel: "+$19",
              description:
                "Mount your soundbar directly to the wall under the TV.",
            },
            {
              value: "attachTvMount",
              label: "Soundbar Attach TV mount",
              cost: 39,
              costLabel: "+$39",
              description:
                "Mount your soundbar directly to the TV bracket for a floating look.",
            },
          ],
        },
        {
          name: "screenInstallation",
          type: "radio",
          isRequired: true,
          label: "Do you need Projector Screen Installation?",
          showIf: {
            field: "tv-size.tvSelection",
            condition: "equals",
            value: "projectorsNScreens",
          },
          options: [
            {
              value: "no",
              label: "No",
              hideFromBreakdown: true,
              cost: 0,
              costLabel: "+$0",
            },
            {
              value: "yes",
              label: "Yes",
              breakdownLabel: "Screen Installation",
              cost: 69,
              costLabel: "+$69",
              description: "Professional screen installation.",
            },
          ],
        },
      ],
    },
    {
      id: "contactInfo",
      title: "Address",
      fields: [
        {
          name: "temp",
          type: "radio",
          label: "Service Address",
          options: [],
        },
        {
          name: "name",
          type: "text",
          textLabel: "Enter your name",
          placeholder: "Enter your name *",
          isRequired: true,
        },
        {
          name: "phone",
          type: "tel",
          textLabel: "Enter your phone",
          placeholder: "Enter your number *",
          isRequired: true,
        },
        {
          name: "address",
          type: "text",
          textLabel: "Enter your address",
          placeholder: "Address",
        },
        {
          name: "zipApt",
          type: "splited",
          textLabel: "Enter your zip code and apartment/unit",
          fields: [
            {
              name: "zip",
              type: "text",
              placeholder: "Zip Code *",
              isRequired: true,
              minLength: 5,
              maxLength: 5,
            },
            {
              name: "apt",
              type: "text",
              placeholder: "Apt/Unit",
              isRequired: false,
            },
          ],
        },
      ],
    },
  ],
  priceCalculation: {
    baseCost: 0,
    dynamicCosts: [
      "tv-size.tvSelection",
      "tv-size.extraTechnicans",
      "mounting.mountType",
      "wall.wallType",
      "wall.fireplace",
      "wall.wires",
      "additionalServices.soundbar",
      "additionalServices.soundbarMount",
    ],
  },
};

const NewQuizScheme = {
  steps: [
    {
      id: "tv-size",
      title: "TV Size",
      fields: [
        {
          name: "tvSelection",
          type: "radio",
          isRequired: true,
          label: "What size TV do you have?",
          options: [
            { value: "under31", label: 'Under 31"', cost: 69 },
            { value: "32-59", label: '32"-59"', cost: 125 },
            { value: "60-69", label: '60"-69"', cost: 144 },
            { value: "70-85", label: '70"-85"', cost: 149 },
            { value: "over-86", label: '98"-100"', cost: 189 },
            {
              value: "notSure",
              label: "Not Sure",
              cost: 125,
              costLabel: "TBD",
            },
          ],
        },
      ],
    },
    {
      id: "mounting",
      title: "Mount Type",
      fields: [
        {
          name: "mountType",
          type: "radio",
          isRequired: true,
          label: "Choose mount type",
          options: [
            {
              value: "alreadyThere",
              label: "Already there",
              cost: 0,
              description:
                "Already have your own mount? Perfect! We’ll safely install your TV on your existing bracket at no extra cost.",
            },
            {
              value: "fixed",
              label: "Fixed Mount",
              subtitle: "1.5” from wall",
              cost: 44,
              description:
                "Clean and reliable: keeps your TV close to the wall for a sleek, modern look",
            },
            {
              value: "tilting",
              label: "Tilt Mount",
              subtitle: "up to 15° tilt",
              cost: 52,
              description:
                "Adjust the vertical angle to reduce glare and get the perfect view from any seating position.",
            },
            {
              value: "fullMotion",
              label: "Full-Motion Mount",
              subtitle: "extends up to 15”",
              cost: 69,
              description:
                "maximum flexibility: pull, swivel, and tilt your TV to enjoy the best viewing angle anywhere in the room.",
            },
            {
              value: "corner",
              label: "Corner Mount",
              subtitle: "fits TVs up to 75”",
              cost: 69,
              costLabel: "+$69",
              description:
                "the ideal solution for corner setups: saves space while keeping your room stylish and functional.",
            },
            {
              value: "ceilingMount",
              label: "Ceiling Mount",
              subtitle: "",
              cost: 69,
              description:
                "a unique option when walls are occupied or for a bold interior design: mount your TV directly to the ceiling.",
            },
            {
              value: "ultraSlim",
              label: "Ultra Slim 0.3",
              subtitle: "ultra thin profile",
              cost: 79,
              description:
                "ultra low profile mount: keeps the TV extremely close to the wall for a picture-frame effect.",
            },
            {
              value: "needHelp",
              label: "Need help choosing",
              subtitle: "Consult with technician",
              cost: 0,
              costLabel: "TBD",
              description:
                "Not sure which mount fits your space? Our professional technician will bring different types and help you choose the best one on-site.",
            },
          ],
        },
      ],
    },
    {
      id: "wall",
      title: "Wall Type",
      fields: [
        {
          name: "wallType",
          type: "radio",
          isRequired: true,
          label: "What type of wall?",
          options: [
            { value: "drywall", label: "Drywall", cost: 0 },
            {
              value: "stoneBrickConcrete",
              label: "Brick / Stone / Concrete",
              cost: 49,
            },
            { value: "ceiling", label: "Ceiling", cost: 39 },
            { value: "tile", label: "Tile", cost: 69 },
            { value: "metalStuds", label: "Metal Studs", cost: 30 },
            { value: "notSure", label: "Not Sure", cost: 0, costLabel: "TBD" },
          ],
        },
      ],
    },
    {
      id: "fireplace",
      title: "Fireplace",
      showIf: {
        field: "wall.wallType",
        condition: "equalsAny",
        values: ["drywall", "stoneBrickConcrete", "tile", "ceiling"],
      },
      fields: [
        {
          name: "fireplace",
          type: "radio",
          isRequired: true,
          label: "Mounting above a fireplace?",
          showIf: {
            field: "mounting.mountType",
            condition: "notEquals",
            value: "ceilingMount",
          },
          options: [
            {
              value: "yes",
              label: "Yes",
              breakdownLabel: "Above Fireplace",
              cost: 32,
              costLabel: "+$32",
              description: "Above Fireplace installation.",
            },
            {
              value: "no",
              label: "No",
              hideFromBreakdown: true,
              cost: 0,
              costLabel: "+$0",
            },
          ],
        },
        {
          name: "addons",
          type: "checkboxGroup",
          label: "Do you need any addons?",
          options: [
            {
              value: "soundbar",
              label: "Soundbar Installation",
              cost: 69,
              costLabel: "+$69",
            },
            {
              value: "gamingConsole",
              label: "Gaming Console Mounting",
              cost: 50,
              costLabel: "+$50",
            },
            {
              value: "ledLight",
              label: "LED Light Strip Installation",
              cost: 39,
              costLabel: "+$39",
            },
            {
              value: "paintings",
              label: "Install Painting or Mirrors",
              cost: 39,
              costLabel: "+$39",
            },
          ],
        },
      ],
    },
    {
      id: "wires",
      title: "Cable Concealment",
      fields: [
        // Case 1: Drywall / Metal Studs + NOT above fireplace
        {
          name: "wires",
          type: "radio",
          isRequired: true,
          label: "Do you want to hide the wires?",
          description:
            "*For hidden wires we cut two openings — one behind the TV and another near the power outlet — to neatly hide the power cable inside the wall. To complete the look, we install sleek white cover plates for a clean and seamless finish.",
          showIf: {
            all: [
              {
                field: "wall.wallType",
                condition: "equalsAny",
                values: ["drywall", "metalStuds"],
              },
              {
                field: "fireplace.fireplace",
                condition: "notEquals",
                value: "yes",
              },
            ],
          },
          options: [
            {
              value: "open",
              label: "Exposed",
              subtitle: "no extra charge",
              cost: 0,
              costLabel: "+$0",
              description:
                "standard setup with visible wires, quick and simple.",
            },
            {
              value: "cableChannelDrywall",
              label: "Cable Channel",
              cost: 43,
              costLabel: "+$43",
              description:
                "a sleek plastic channel to neatly hide and organize wires along the wall.",
            },
            {
              value: "wallDrywall",
              label: "Put it in the wall",
              cost: 93,
              costLabel: "+$93",
              description:
                "professional in-wall cable concealment: wires run behind the wall with clean cover plates for a seamless look.",
            },
            {
              value: "socketDrywall",
              label: "In wall with socket",
              cost: 129,
              costLabel: "+$129",
              description:
                "premium solution: full in-wall cable concealment plus a recessed power outlet for the cleanest, most professional finish.",
            },
            {
              value: "notSure",
              label: "Not Sure",
              cost: 0,
              costLabel: "TBD",
            },
          ],
        },
        // Case 2: Drywall / Metal Studs + ABOVE fireplace
        {
          name: "wires",
          type: "radio",
          isRequired: true,
          label: "Do you want to hide the wires?",
          description:
            "*For hidden wires we cut two openings — one behind the TV and another near the power outlet — to neatly hide the power cable inside the wall.",
          showIf: {
            all: [
              {
                field: "wall.wallType",
                condition: "equalsAny",
                values: ["drywall", "metalStuds"],
              },
              {
                field: "fireplace.fireplace",
                condition: "equals",
                value: "yes",
              },
            ],
          },
          options: [
            {
              value: "open",
              label: "Exposed",
              subtitle: "no extra charge",
              cost: 0,
              costLabel: "+$0",
              description:
                "standard setup with visible wires, quick and simple.",
            },
            {
              value: "cableChannelDrywall",
              label: "Cable Channel",
              cost: 43,
              costLabel: "+$43",
              description:
                "a sleek plastic channel to neatly hide and organize wires along the wall.",
            },
            {
              value: "wallFireplace",
              label: "In-Wall Concealment",
              cost: 109,
              costLabel: "+$109",
              description:
                "wires run behind the wall with clean cover plates for a seamless look.",
            },
            {
              value: "socketFireplace",
              label: "In Wall with Socket",
              cost: 149,
              costLabel: "+$149",
              description:
                "premium solution: full in-wall cable concealment plus a recessed power outlet for the cleanest, most professional finish.",
            },
            {
              value: "notSure",
              label: "Not Sure",
              cost: 0,
              costLabel: "TBD",
            },
          ],
        },
        // Case 3: Hard Surface (Stone/Brick/Concrete, Tile, Ceiling)
        {
          name: "wires",
          type: "radio",
          isRequired: true,
          label: "Do you want to hide the wires?",
          description:
            "*For hidden wires we cut two openings — one behind the TV and another near the power outlet — to neatly hide the power cable inside the wall. To complete the look, we install sleek white cover plates for a clean and seamless finish.",
          showIf: {
            field: "wall.wallType",
            condition: "equalsAny",
            values: ["stoneBrickConcrete", "tile", "ceiling"],
          },
          options: [
            {
              value: "open",
              label: "Exposed",
              subtitle: "no extra charge",
              cost: 0,
              costLabel: "+$0",
              description: "visible wires, fast and simple setup.",
            },
            {
              value: "cableChannelBrick",
              label: "Cable channel",
              cost: 52,
              costLabel: "+$52",
              description:
                "neat surface channel to keep cables organized on brick, concrete, or tile.",
            },
            {
              value: "wallBrick",
              label: "In-Wall Concealment",
              cost: 249,
              costLabel: "+$249",
              description:
                "we cut the surface with a diamond grinder, hide the cables, add a brush plate, and seal edges with silicone for a clean finish.",
            },
            {
              value: "socketBrick",
              label: "In-Wall with Socket",
              cost: 289,
              costLabel: "+$289",
              description:
                "premium option: full in-wall concealment plus recessed power outlet, finished with brush plates and silicone detailing.",
            },
            {
              value: "notSure",
              label: "Not Sure",
              cost: 0,
              costLabel: "TBD",
            },
          ],
        },
        // Case 4: Wall type is Not Sure (Show simple options)
        {
          name: "wires",
          type: "radio",
          isRequired: true,
          label: "Do you want to hide the wires?",
          showIf: {
            field: "wall.wallType",
            condition: "equals",
            value: "notSure",
          },
          options: [
            {
              value: "yes",
              label: "Yes, hide all wires",
              cost: 109,
              costLabel: "TBD",
            },
            { value: "no", label: "No, standard installation", cost: 0 },
            { value: "notSure", label: "Not Sure", cost: 0, costLabel: "TBD" },
          ],
        },
      ],
    },
    {
      id: "contactInfo",
      title: "Address",
      fields: [
        {
          name: "temp",
          type: "radio",
          label: "Contact Details",
          options: [],
        },
        {
          name: "name",
          type: "text",
          textLabel: "Enter your name",
          placeholder: "Name",
          isRequired: false,
        },
        {
          name: "phone",
          type: "tel",
          textLabel: "Enter your phone",
          placeholder: "Phone Number *",
          isRequired: true,
        },
        {
          name: "zip",
          type: "text",
          textLabel: "Enter your zip code",
          placeholder: "Zip Code",
          isRequired: false,
        },
      ],
    },
  ],
  priceCalculation: {
    baseCost: 0,
    dynamicCosts: [
      "tv-size.tvSelection",
      "mounting.mountType",
      "wall.wallType",
      "wires.wires",
    ],
  },
};

const BestQuoteModal = () => {
  const { isOpen, close, data } = useModalState("BestQuote");
  const { openModal } = useModal();
  const router = useRouter();
  const [formData, setFormData] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [structuredCostBreakdown, setStructuredCostBreakdown] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [totalSteps, setTotalSteps] = useState(5);
  const [isMobile, setIsMobile] = useState(false);

  const pathname = usePathname();
  const isNewQuiz = data?.props?.isNewQuiz !== false;
  const tvSelection = formData["tv-size"]?.tvSelection;

  const currentScheme = useMemo(() => {
    let fixedCost = 44;
    let tiltCost = 52;
    let fullMotionCost = 69;

    if (tvSelection === "over-86") {
      fixedCost = 72;
      tiltCost = 89;
      fullMotionCost = 199;
    } else if (tvSelection === "70-85") {
      fixedCost = 44;
      tiltCost = 52;
      fullMotionCost = 79;
    }

    const schemeToUse = isNewQuiz ? NewQuizScheme : BestQuoteScheme;

    const updatedSteps = schemeToUse.steps.map((step) => {
      if (step.id === "mounting") {
        return {
          ...step,
          fields: step.fields.map((field) => {
            if (field.name === "mountType") {
              let options = field.options;
              if (tvSelection === "over-86") {
                options = options.filter((opt) => opt.value !== "corner");
              }
              return {
                ...field,
                options: options.map((opt) => {
                  if (opt.value === "fixed") {
                    return {
                      ...opt,
                      cost: fixedCost,
                      costLabel: `+$${fixedCost}`,
                    };
                  }
                  if (opt.value === "tilting") {
                    return {
                      ...opt,
                      cost: tiltCost,
                      costLabel: `+$${tiltCost}`,
                    };
                  }
                  if (opt.value === "fullMotion") {
                    return {
                      ...opt,
                      cost: fullMotionCost,
                      costLabel: `+$${fullMotionCost}`,
                      subtitle:
                        tvSelection === "over-86"
                          ? ""
                          : tvSelection === "70-85"
                            ? '75"–86"'
                            : '<70"',
                      description:
                        tvSelection === "over-86"
                          ? "premium heavy-duty full-motion bracket supporting up to 100 inches."
                          : tvSelection === "70-85"
                            ? "specially designed for larger screens: sturdy arms with full rotation and extendability."
                            : "maximum flexibility: pull, swivel, and tilt your TV to enjoy the best viewing angle anywhere in the room.",
                    };
                  }
                  if (opt.value === "ceilingMount") {
                    const ceilingCost = tvSelection === "over-86" ? 99 : 69;
                    return {
                      ...opt,
                      cost: ceilingCost,
                      costLabel: `+$${ceilingCost}`,
                    };
                  }
                  return opt;
                }),
              };
            }
            return field;
          }),
        };
      }
      return step;
    });

    return {
      ...schemeToUse,
      steps: updatedSteps,
    };
  }, [tvSelection, isNewQuiz]);

  const isLastStep =
    currentScheme && currentScheme.steps
      ? currentStepIndex === currentScheme.steps.length - 1
      : false;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isFormValid = isNewQuiz
    ? !!(
        formData.contactInfo?.phone &&
        validatePhone(formData.contactInfo?.phone)
      )
    : !!(
        formData.contactInfo?.name &&
        validatePhone(formData.contactInfo?.phone) &&
        formData.contactInfo?.zipApt?.zip
      );

  useEffect(() => {
    if (!isOpen) {
      setFormData({});
      setCurrentStepIndex(0);
      setTotalSteps(5);
    } else {
      setCurrentStepIndex(0);
    }
  }, [isOpen]);
  async function onSubmit(e) {
    e?.preventDefault?.();
    setIsSubmitting(true);
    console.log("formData", formData);

    const wallTypeResolved = isNewQuiz
      ? formData.wall?.wallType || ""
      : formData.wall?.wallType || formData.wall?.wallTypeProjector || "";

    const tvCountResolved = "1";

    const contactInfoResolved = isNewQuiz
      ? {
          name: formData.contactInfo?.name || "",
          phone: formData.contactInfo?.phone || "",
          zip: formData.contactInfo?.zip || "",
          apt: "",
        }
      : {
          ...formData.contactInfo,
          zip: formData.contactInfo?.zipApt?.zip || "",
          apt: formData.contactInfo?.zipApt?.apt || "",
        };

    const submissionData = {
      ...formData,
      tvCount: tvCountResolved,
      wall: isNewQuiz
        ? {
            wallType: wallTypeResolved,
            fireplace: formData.fireplace?.fireplace || "",
            wires: formData.wires?.wires || "",
          }
        : {
            ...formData.wall,
            wallType: wallTypeResolved,
          },
      contactInfo: contactInfoResolved,
      ...getUtmParams(),
      submittedAt: new Date().toISOString(),
      timestamp: Date.now(),
    };

    if (submissionData.wall?.wallTypeProjector) {
      delete submissionData.wall.wallTypeProjector;
    }

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_SRTAPI_URL || "http://localhost:1337";
      const response = await fetch(`${apiUrl}/api/best-quote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: submissionData,
        }),
      });
      if (response.ok) {
        // Build return URL: if we're on the quiz page, it's already set by QuizClient.
        // If we're on a city page, save current path as the return point.
        if (!window.location.pathname.includes("/quiz")) {
          sessionStorage.setItem("quiz_return_url", window.location.pathname);
        }

        sessionStorage.setItem("form_submitted", "true");
        localStorage.setItem(
          "pricingData",
          JSON.stringify({ totalPrice, structuredCostBreakdown }),
        );

        if (typeof dataLayer !== "undefined") {
          dataLayer.push({
            event: "quiz_send_ok",
            name: submissionData.contactInfo?.name || "",
            phone: submissionData.contactInfo?.phone?.replace(/\D/g, "") || "",
            "user_data.phone_number":
              submissionData.contactInfo?.phone?.replace(/\D/g, "") || "",
            zip: submissionData.contactInfo?.zip || "",
            apt: submissionData.contactInfo?.apt || "",
            address: submissionData.contactInfo?.address || "",
            totalPrice: totalPrice,
            tvSelection:
              formData["tv-size"]?.tvSelection ||
              formData["tv-size"]?.tvSelectionMulti ||
              "",
            extraTechnicians: formData["tv-size"]?.extraTechnicans || "",
            mountType: formData.mounting?.mountType || "",
            wallType: wallTypeResolved,
            fireplace: isNewQuiz
              ? formData.fireplace?.fireplace || ""
              : formData.wall?.fireplace || "",
            wires: isNewQuiz
              ? formData.wires?.wires || ""
              : formData.wall?.wires || "",
            utm_params: getUtmParams(),
          });
        }

        close();
        setFormData({});
        if (typeof gtag !== "undefined") {
          gtag("event", "conversion", {
            send_to: "AW-17416148778/aAZCCNeF9vsaEKqu1fBA",
          });
        }
        router.push("/booking-success");
      } else {
        const errorData = await response.json();
        console.error("Form submission error:", errorData);
        alert("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Failed to send form:", error);
      alert("Failed to send request. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handlePriceChange = (newTotalPrice, newStructuredCostBreakdown) => {
    setTotalPrice(newTotalPrice);
    setStructuredCostBreakdown(newStructuredCostBreakdown);
  };

  const currentStepId = currentScheme?.steps?.[currentStepIndex]?.id;
  const hideDiscountBanner = currentStepId === "fireplace";

  return (
    <Modal
      className={styles.bestQuoteModalcontent}
      isOpen={isOpen}
      onClose={close}
    >
      <header className={styles.bestQuoteHeader}>
        <LogoSVG width="82" height="40" role="img" />
      </header>
      <div className={styles.bestQuote}>
        <main className={styles.bestQuoteMain}>
          <Form
            key={isOpen ? `open-${isNewQuiz}` : "closed"}
            scheme={currentScheme}
            value={formData}
            onChange={setFormData}
            onPriceChange={handlePriceChange}
            onSubmit={onSubmit}
            onStepChange={(stepIdx, subStepIdx, total) => {
              setCurrentStepIndex(stepIdx);
              setTotalSteps(total || 5);
            }}
            disableSubmitBtn={isSubmitting}
            isMobile={isMobile}
            initialStepIndex={currentStepIndex}
            onClose={close}
          />
          <div className={styles.space}></div>
          {hideDiscountBanner || (isMobile && currentStepIndex === 0) || (
            <div className={styles.discountBanner}>
              <p className={styles.discountLabel}>Installing 2 or more TVs?</p>
              <p className={styles.discountText}>
                Let the manager know to receive a multi-TVs{" "}
                <span className={styles.discountPercent}>DISCOUNT</span>.
              </p>
            </div>
          )}
          {isMobile && isLastStep && (
            <>
              <div style={{ flexGrow: 1 }}></div>
              <div className={styles.mobileBookSection}>
                <Button
                  className={styles.mobileBookBtn}
                  disabled={!isFormValid || isSubmitting}
                  onClick={onSubmit}
                  size="big"
                >
                  {isSubmitting ? "Booking..." : "Book Now"}
                </Button>
                <p className={styles.mobileTermsText}>
                  By booking an appointment you agree to the <br />
                  <Link href="/terms">Terms of Service</Link> and the{" "}
                  <Link href="/privacy-policy">Privacy Policy</Link>.
                </p>
              </div>
            </>
          )}
        </main>
        <aside className={styles.servicesContainer}>
          <div className={styles.orderInfo}>
            <p className={styles.orderTitle}>Your order</p>
            {/* <p className={styles.orderItem}>FREE Above-Fireplace TV Installation</p>*/}
            <p className={styles.orderDisclaimer}>
              Prices shown are estimates. Final cost will be confirmed by your
              technician.
            </p>
            <hr className={styles.orderDivider} />
          </div>
          <div className={styles.tempWrapp}>
            <div className={styles.priceWrapper}>
              <PriceSummary
                totalPrice={totalPrice}
                structuredCostBreakdown={structuredCostBreakdown}
                currentStepIndex={currentStepIndex}
                isFormValid={isFormValid}
                isSubmitting={isSubmitting}
                onSubmit={onSubmit}
                isLastStep={isLastStep}
              />
            </div>
          </div>
        </aside>
      </div>
    </Modal>
  );
};

export default BestQuoteModal;
