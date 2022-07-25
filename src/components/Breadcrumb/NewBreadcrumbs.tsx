import React from "react";
import { Breadcrumb, Typography } from "antd";
import { withRouter } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import routes from "../../Routes";

const NewBreadcrumbs = (props: any) => {
  //   const pathnames = pathname.split("/").filter((x: string) => x);
  const crumbs = routes
    // Get all routes that contain the current one.
    .filter(({ path }) => props.match.path.includes(path))
    // Swap out any dynamic routes with their param values.
    // E.g. "/pizza/:pizzaId" will become "/pizza/1"
    .map(({ path, ...rest }) => ({
      path: Object.keys(props.match.params).length
        ? Object.keys(props.match.params).reduce(
            (path, param) =>
              path.replace(`:${param}`, props.match.params[param]),
            path
          )
        : path,
      ...rest,
    }));
  return (
    <Breadcrumb>
      <Breadcrumb.Item href={"/"}>
        <HomeOutlined />
      </Breadcrumb.Item>
      {crumbs.map(({ name, path }, key: number) => (
        <Breadcrumb.Item key={key} href={path}>
          {name}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default withRouter(NewBreadcrumbs);
