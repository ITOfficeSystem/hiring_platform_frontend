/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Text,
  HStack,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
  Icon,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterOptions?: { value: string; label: string }[];
  emptyMessage?: string;
}

export const DataTable = ({
  data,
  columns,
  searchTerm,
  onSearchChange,
  filterValue,
  onFilterChange,
  filterOptions,
  emptyMessage = "No data found",
}: DataTableProps) => {
  return (
    <Box>
      {/* Filters */}
      {(onSearchChange || onFilterChange) && (
        <HStack spacing={4} mb={6}>
          {onSearchChange && (
            <InputGroup maxW="300px">
              <InputLeftElement>
                <Icon as={FaSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </InputGroup>
          )}

          {onFilterChange && filterOptions && (
            <Select
              maxW="200px"
              value={filterValue}
              onChange={(e) => onFilterChange(e.target.value)}
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          )}
        </HStack>
      )}

      {/* Table */}
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              {columns.map((column) => (
                <Th key={column.key}>{column.label}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {data && data.length > 0 ? (
              data.map((row, index) => (
                <Tr key={index}>
                  {columns.map((column) => (
                    <Td key={column.key}>
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </Td>
                  ))}
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={columns.length} textAlign="center" py={8}>
                  <Text color="gray.500">{emptyMessage}</Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {data?.length === 0 && (
        <Box textAlign="center" py={8}>
          <Text color="gray.500">{emptyMessage}</Text>
        </Box>
      )}
    </Box>
  );
};
