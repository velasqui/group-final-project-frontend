import { Avatar, Center, Container, Stack, Text, Title } from "@mantine/core";
import { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPalettesByUid } from "../services/palette.service";
import { Palette } from "../types/palette.types";
import AppContainer from "../components/AppContainer";
import AppHeader from "../components/AppHeader";
import { AuthContext } from "../context/auth.context";
import ProfilePaletteDisplay from "../components/ProfilePaletteDisplay";

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [dbPalettes, setDbPalettes] = useState<Palette[]>([]);

  const palettes = useQuery(
    ["palettes", user?.uid],
    async () => await getPalettesByUid(user?.uid as string)
  );

  return (
    <AppContainer>
      <AppHeader />
      <Container size="xs">
        <Stack spacing="xl">
          <Center>
            <Avatar
              src={user?.photoURL}
              alt="Profile image"
              color="blue"
              size={80}
              radius={100}
            >
              {user?.displayName?.charAt(0)}
            </Avatar>
          </Center>
          <div className="text-center">
            <Title order={3}>{user?.displayName}</Title>
          </div>
          <Stack spacing="xl">
            <Center className="flex flex-col">
              {palettes.data?.map((currentPalette) => (
                <div
                  key={currentPalette._id}
                  className="flex flex-row items-center m-2 w-min bg-white p-2 shadow-xl"
                >
                  <ProfilePaletteDisplay palette={currentPalette} />
                </div>
              ))}
            </Center>
          </Stack>
        </Stack>
      </Container>
    </AppContainer>
  );
}
