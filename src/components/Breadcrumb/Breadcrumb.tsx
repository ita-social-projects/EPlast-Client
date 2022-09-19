import React from "react";
import { Breadcrumb as AntdBreadcrumb, Typography } from "antd";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import routes from "../../Routes";

const { Text } = Typography;

type Props = RouteComponentProps & {
  currentLocationName?: string;
};

const Breadcrumb = ({ match, currentLocationName }: Props) => {
  const crumbs = routes
    // Get all routes that contain the current one.
    .filter(({ path }) => match.path.includes(path))
    // Swap out any dynamic routes with their param values.
    // E.g. "/pizza/:pizzaId" will become "/pizza/1"
    .map(({ path, ...rest }) => ({
      path: Object.keys(match.params).length
        ? Object.keys(match.params).reduce(
            (path, param) =>
              path.replace(
                `:${param}`,
                match.params[param as keyof typeof match.params]
              ),
            path
          )
        : path,
      ...rest,
    }));
  return (
    <AntdBreadcrumb>
      <AntdBreadcrumb.Item href={"/"}>
        <HomeOutlined />
      </AntdBreadcrumb.Item>
      {crumbs.map(({ name, path }, key: number) =>
        currentLocationName !== undefined && key === crumbs.length - 1 ? (
          <AntdBreadcrumb.Item key={key}>
            <Text
              style={crumbs.length > 4 ? { maxWidth: 170 } : undefined}
              ellipsis={true}
            >
              {currentLocationName}
            </Text>
          </AntdBreadcrumb.Item>
        ) : (
          <AntdBreadcrumb.Item key={key} href={path}>
            {name}
          </AntdBreadcrumb.Item>
        )
      )}
    </AntdBreadcrumb>
  );
};

export default withRouter(Breadcrumb);
