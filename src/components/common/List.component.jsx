import React from 'react';
import PropTypes from 'prop-types';

function List({ data, renderProps }) {
	return (
		<ul className='list-group'>{data.map((item) => renderProps(item))}</ul>
	);
}

List.propTypes = {
	data: PropTypes.array.isRequired,
	renderProps: PropTypes.func.isRequired,
};

List.defaultProps = {
	data: [],
};

export default List;
