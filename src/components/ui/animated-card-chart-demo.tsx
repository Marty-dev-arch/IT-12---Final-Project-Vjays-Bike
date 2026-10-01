import {
  AnimatedCard,
  CardBody,
  CardDescription,
  CardTitle,
  CardVisual,
  Visual3,
} from "@/components/ui/animated-card-chart";

export default function AnimatedCard3Demo() {
  return (
    <AnimatedCard>
      <CardVisual>
        <Visual3 mainColor="#ff6900" secondaryColor="#71717A" />
      </CardVisual>
      <CardBody>
        <CardTitle>Just find the right caption</CardTitle>
        <CardDescription>
          This card will tell everything you want
        </CardDescription>
      </CardBody>
    </AnimatedCard>
  );
}
