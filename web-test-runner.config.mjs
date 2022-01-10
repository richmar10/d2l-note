export default {
	files: 'test/**/*.test.js',
	nodeResolve: true,
	testRunnerHtml: testFramework =>
		`<html>
			<body>
				<script type="module" src="./tools/resize-observer-test-error-handler.js"></script>;
				<script type="module" src="${testFramework}"></script>
			</body>
		</html>`
};
