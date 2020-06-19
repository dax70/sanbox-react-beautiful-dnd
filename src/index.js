import React, { memo, useState } from "react";
import ReactDOM from "react-dom";
import "normalize.css";
import styled from "@emotion/styled";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import initialData from "./initial-data";
import Column from "./column";

const Container = styled.div`
  display: flex;
`;

const areEqual = (prevProps, nextProps) => {
  return (
    nextProps.column === prevProps.column &&
    nextProps.itemap === prevProps.itemMap &&
    nextProps.index === prevProps.index
  );
};
const InnerList = memo(props => {
  const { column, itemMap, index } = props;
  const items = column.itemIds.map(itemId => itemMap[itemId]);
  return <Column column={column} items={items} index={index} />;
}, areEqual);

const App = () => {
  const [data, setData] = useState(initialData);

  const onDragStart = start => {};

  const onDragUpdate = update => {};

  const onDragEnd = results => {
    const { destination, source, draggableId, type } = results;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "column") {
      const newColumnOrder = Array.from(data.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newState = {
        ...data,
        columnOrder: newColumnOrder
      };

      setData(newState);
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newitemIds = Array.from(start.itemIds);
      newitemIds.splice(source.index, 1);
      newitemIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        itemIds: newitemIds
      };

      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn
        }
      };

      setData(newState);
      return;
    }

    // Moving from one list to another.
    const startitemIds = Array.from(start.itemIds);
    startitemIds.splice(source.index, 1);
    const newStart = {
      ...start,
      itemIds: startitemIds
    };

    const finishitemIds = Array.from(finish.itemIds);
    finishitemIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      itemIds: finishitemIds
    };

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    };

    setData(newState);
  };
  return (
    <DragDropContext
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate}
      onDragEnd={onDragEnd}
    >
      <Droppable droppableId="all-columns" direction="horizontal" type="column">
        {provided => (
          <Container {...provided.droppableProps} ref={provided.innerRef}>
            {data.columnOrder.map((columnId, index) => {
              const column = data.columns[columnId];

              return (
                <InnerList
                  key={column.id}
                  column={column}
                  itemMap={data.items}
                  index={index}
                />
              );
            })}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);
