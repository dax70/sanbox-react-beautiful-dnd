import React, { memo } from "react";
import styled from "@emotion/styled";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Item from "./item";

const Container = styled.div`
  margin: 8px;
  background-color: white;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: 220px;

  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  padding: 8px;
`;
const ItemList = styled.div`
  padding: 8px;
  background-color: ${props => (props.isDragginOver ? "lightgrey" : "inherit")};
  flex-grow: 1;
  min-height: 100px;
`;

const InnerList = memo(props => {
  return props.items.map((item, index) => (
    <Item key={item.id} item={item} index={index} />
  ));
});

const Column = props => {
  return (
    <Draggable draggableId={props.column.id} index={props.index}>
      {provided => (
        <Container {...provided.draggableProps} ref={provided.innerRef}>
          <Title {...provided.dragHandleProps}>{props.column.title}</Title>
          <Droppable droppableId={props.column.id} type="item">
            {provided => (
              <ItemList
                ref={provided.innerRef}
                {...provided.droppableProps}
                // isDragginOver={snapshot.isDraggingOver}
              >
                <InnerList items={props.items} />
                {provided.placeholder}
              </ItemList>
            )}
          </Droppable>
        </Container>
      )}
    </Draggable>
  );
};

export default Column;
