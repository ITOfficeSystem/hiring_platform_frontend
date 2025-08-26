import { SimpleGrid, Card, CardBody, Stat, StatLabel, StatNumber, StatHelpText } from "@chakra-ui/react"

interface StatItem {
  label: string
  value: number | string
  helpText?: string
  color?: string
}

interface StatsGridProps {
  stats: StatItem[]
  columns?: { base: number; md: number; lg?: number }
}

export const StatsGrid = ({ stats, columns = { base: 2, md: 3, lg: 5 } }: StatsGridProps) => {
  return (
    <SimpleGrid columns={columns} spacing={6}>
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardBody>
            <Stat>
              <StatLabel>{stat.label}</StatLabel>
              <StatNumber color={stat.color}>{stat.value}</StatNumber>
              {stat.helpText && <StatHelpText>{stat.helpText}</StatHelpText>}
            </Stat>
          </CardBody>
        </Card>
      ))}
    </SimpleGrid>
  )
}
