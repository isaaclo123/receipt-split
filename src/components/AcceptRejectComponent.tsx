import React from "react";

import Col from "react-bootstrap/Col";

import { ListGroup } from "react-bootstrap";

import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import ButtonGroup from "react-bootstrap/ButtonGroup";

export type AcceptRejectButtonsType = Array<"accept" | "reject" | "pending">;

export type AcceptRejectComponentProps = {
  messageComponent ?: React.ReactNode;
  accepted?: boolean | null;

  onAccept?: () => void;
  onPending?: () => void;
  onReject?: () => void;

  acceptText?: string;
  rejectText?: string;
  pendingText?: string;

  buttons: AcceptRejectButtonsType;
}

export const AcceptRejectComponent = ({
  onAccept = () => {},
  onReject = () => {},
  onPending = () => {},
  messageComponent = null,
  accepted = null,
  acceptText = "ACCEPT",
  rejectText = "REJECT",
  pendingText = "PENDING",
  buttons
}: AcceptRejectComponentProps) => {
  return (
    <ListGroup.Item variant={(() => {
      if (accepted === true) {
        return "success";
      }
      if (accepted === false) {
        return "danger";
      }
    })()}>
      <Row>
        <Col className="mt-1 d-inline-block text-truncate pr-0">
          <span>
            {messageComponent}
          </span>
        </Col>
        <Col md="auto">
          <ButtonGroup>
            {buttons.map((button) => {
              switch(button) {
                case "accept":
                  return (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={onAccept}>
                      {acceptText}
                    </Button>
                  );
                case "reject":
                  return (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={onReject}>
                      {rejectText}
                    </Button>
                  );
                case "pending":
                  return (
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={onPending}>
                      {pendingText}
                    </Button>
                );
                default:
                  return null;
              }
            })}
          </ButtonGroup>
        </Col>
      </Row>
    </ListGroup.Item>
  );
};
