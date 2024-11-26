import { Container } from "@mui/material";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <div className="min-h-screen flex flex-col">
      {/* Main content */}
      <Container maxWidth={"xl"} sx={{ flexGrow: 1, marginBlock: "1rem" }}>
        {children}
      </Container>
     </div>
    </>
  );
}