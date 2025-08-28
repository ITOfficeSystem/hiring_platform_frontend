"use client";

import { HStack, Button } from "@chakra-ui/react";
import {
  FaCheck,
  FaTimes,
  FaEye,
  FaEnvelope,
  FaTrash,
  FaEdit,
} from "react-icons/fa"; // Import FaEdit

interface ActionButtonsProps {
  onView?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onSendEmail?: () => void;
  onDelete?: () => void;
  onEdit?: () => void; // New prop for edit action
  showView?: boolean;
  showApprove?: boolean;
  showReject?: boolean;
  showEmail?: boolean;
  showDelete?: boolean;
  showEdit?: boolean; // New prop to control edit button visibility
  isLoading?: boolean;
}

export const ActionButtons = ({
  onView,
  onApprove,
  onReject,
  onSendEmail,
  onDelete,
  onEdit, // Destructure new prop
  showView = true,
  showApprove = false,
  showReject = false,
  showEmail = false,
  showDelete = false,
  showEdit = false, // Default to false
  isLoading = false,
}: ActionButtonsProps) => {
  return (
    <HStack spacing={2}>
      {showView && onView && (
        <Button
          size="sm"
          variant="outline"
          leftIcon={<FaEye />}
          onClick={onView}
        >
          Review
        </Button>
      )}

      {showApprove && onApprove && (
        <Button
          size="sm"
          colorScheme="green"
          leftIcon={<FaCheck />}
          onClick={onApprove}
          isLoading={isLoading}
        >
          Approve
        </Button>
      )}

      {showReject && onReject && (
        <Button
          size="sm"
          colorScheme="red"
          leftIcon={<FaTimes />}
          onClick={onReject}
          isLoading={isLoading}
        >
          Reject
        </Button>
      )}

      {showEmail && onSendEmail && (
        <Button
          size="sm"
          colorScheme="blue"
          leftIcon={<FaEnvelope />}
          onClick={onSendEmail}
          isLoading={isLoading}
        >
          Send Email
        </Button>
      )}

      {showEdit && onEdit && (
        <Button
          size="sm"
          colorScheme="blue"
          variant="outline"
          leftIcon={<FaEdit />}
          onClick={onEdit}
          isLoading={isLoading}
        >
          Edit
        </Button>
      )}

      {showDelete && onDelete && (
        <Button
          size="sm"
          colorScheme="red"
          variant="outline"
          leftIcon={<FaTrash />}
          onClick={onDelete}
          isLoading={isLoading}
        >
          Delete
        </Button>
      )}
    </HStack>
  );
};
