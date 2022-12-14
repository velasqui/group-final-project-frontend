import { useContext, useState } from "react";
import { Palette } from "../types/palette.types";
import { Paper, Title, Text, Stack, TextInput, Modal } from "@mantine/core";
import { AuthContext } from "../context/auth.context";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { IconAlertCircle } from "@tabler/icons";
import { error } from "console";
import { PaletteContext } from "../context/palette.context";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../libs/react-query";
import { addPalette } from "../services/palette.service";
import PaletteDisplay from "./PaletteDisplay";
import FormPaletteDisplay from "./FormPaletteDisplay";

interface Props {
  opened: boolean;
  onClose: () => void;
}

export default function PaletteInfoForm({ onClose, opened }: Props) {
  const { palette } = useContext(PaletteContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<Palette>();

  const addPaletteMutation = useMutation(addPalette, {
    onSuccess: () => {
      queryClient.invalidateQueries(["palettes", user?.uid]);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onSubmit = async (data: Partial<Palette>) => {
    if (!user) {
      navigate("/login");
    }
    await addPaletteMutation.mutateAsync({
      uid: user?.uid,
      textColor: "black",
      name: data.name,
      primaryColor: palette.primaryColor,
      secondaryColor: palette.secondaryColor,
      tertiaryColor: palette.tertiaryColor,
    });
    reset();
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose}>
      <div>
        <Title>Name Your Palette</Title>

        <div>
          <FormPaletteDisplay />
        </div>

        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              label="Palette name"
              withAsterisk
              {...register("name", { required: true })}
              error={errors.name && "Palette name is required"}
            />
            <button type="submit">Save Palette</button>
          </form>
        </div>
      </div>
    </Modal>
  );
}
