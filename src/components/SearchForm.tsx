import React, { useContext, useEffect, useState } from "react";
import { getColorScheme } from "../services/color.api.service";
import { Color } from "../types/color.types";
import ColorPlay from "./ColorPlay";
import PaletteDisplay from "./PaletteDisplay";
import { PaletteContext } from "../context/palette.context";
import { Palette } from "../types/palette.types";
import PaletteInfoForm from "./PaletteInfoForm";
import { Center, Container, Stack, Tabs } from "@mantine/core";

export default function SearchForm() {
  const { palette, setPalette } = useContext(PaletteContext);
  const [colors, setColors] = useState<string[]>([]);
  const [inputMood, setInputMood] = useState("calm");
  const [mood, setMood] = useState("180,80%,80%");
  const [userInput, setUserInput] = useState("");

  const [opened, setOpened] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUserInput(e.target.value);
  }

  function handleMoodChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setInputMood(e.target.value);
    if (e.target.value === "calm") {
      setMood(createHSL(165, 260, 80, 100, 50, 85));
    } else if (e.target.value === "energetic") {
      setMood(createHSL(45, 80, 80, 100, 50, 85));
    } else if (e.target.value === "powerful") {
      setMood(createHSL(20, 0, 80, 100, 50, 85));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (inputMood === "calm") {
      if (Math.random() > 0.5) {
        setMood(createHSL(165, 260, 80, 100, 70, 95)); //blue
      } else {
        setMood(createHSL(75, 165, 80, 100, 70, 95)); //green
      }
    }

    if (inputMood === "energetic") {
      if (Math.random() > 0.5) {
        setMood(createHSL(45, 80, 80, 100, 70, 95)); //yellow
      } else {
        setMood(createHSL(20, 45, 80, 100, 70, 95)); //orange
      }
    }

    if (inputMood === "powerful") {
      if (Math.random() > 0.5) {
        setMood(createHSL(20, 0, 80, 100, 70, 95)); //red
      } else {
        setMood(createHSL(275, 310, 80, 100, 70, 95)); //purple
      }
    }

    getColorScheme(mood, "monochrome", 6).then((response) => {
      setColors([
        response.data.colors[1].hsl.value,
        response.data.colors[5].hsl.value,
        `hsl(${response.data.colors[1].hsl.h - 180}, ${
          response.data.colors[1].hsl.s - 40
        }%, ${response.data.colors[1].hsl.l + 20}%`,
      ]);
      setPalette({
        ...palette,
        name: "new palette",
        primaryColor: response.data.colors[5].hsl.value,
        secondaryColor: response.data.colors[1].hsl.value,
        tertiaryColor: `hsl(${response.data.colors[1].hsl.h - 180}, ${
          response.data.colors[1].hsl.s - 40
        }%, ${response.data.colors[1].hsl.l + 20}%`,
      });
      // setComplementColors;
      return response;
    });
  }

  function createHSL(
    hMax: number,
    hMin: number,
    sMax: number,
    sMin: number,
    lMax: number,
    lMin: number
  ) {
    const h = Math.round(Math.random() * (hMax - hMin) + hMin);
    const s = Math.round(Math.random() * (sMax - sMin) + sMin);
    const l = Math.round(Math.random() * (lMax - lMin) + lMin);
    return `${h},${s}%,${l}%`;
  }

  function showForm() {
    setOpened(true);
  }

  return (
    <div>
      <div className="theColorAPI flex flex-col items-center bg-white md:flex-row justify-center">
        <form action="">
          {/* <label>Color Search</label>
          <input
            type="text"
            className="border-solid border-1 border-black"
            id="inputColor"
            value={userInput}
            onChange={handleChange}
          /> */}
          <label className="" htmlFor="">
            Select a Mood
          </label>
          <select
            name="mood"
            id="mood"
            onChange={handleMoodChange}
            className="border-solid border-2 border-slate-200 p-2 m-2"
          >
            <option value="calm">Calm</option>
            <option value="energetic">Energetic</option>
            <option value="powerful">Powerful</option>
          </select>
          <button
            className="rounded bg-slate-200 p-2 m-1"
            id="scheme-button"
            type="submit"
            onClick={handleSubmit}
          >
            Get Colors
          </button>
        </form>
        <div className="palette flex flex-row">
          <Container className=" m-2 w-min bg-white p-2 shadow-xl">
            <Stack>
              <Center>
                {colors.map((color, index) => (
                  <PaletteDisplay key={index} color={color} />
                ))}
              </Center>
            </Stack>
          </Container>
          {/* {analogColors.map((color, index) => (
            <PaletteDisplay key={index} color={color} />
          ))} */}

          {/* {complementColors.map((color, index) => (
            <PaletteDisplay key={index} color={color} />
          ))} */}
        </div>{" "}
        <button
          className="rounded bg-slate-200 p-2 m-1"
          onClick={showForm}
          type="button"
        >
          Save Color Palette
        </button>
      </div>

      {/* <ColorPlay /> */}
      <PaletteInfoForm opened={opened} onClose={() => setOpened(false)} />
    </div>
  );
}
