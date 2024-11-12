.PHONY: vscode-web

VERSION=1.95.2

vscode-web:
	rm -rf ./dist && mkdir -p ./dist
	docker build -t vscode-web . --build-arg VERSION=$(VERSION)
	docker run --rm -v ./dist:/dist vscode-web

vscode:
	git clone --depth 1 https://github.com/microsoft/vscode.git -b $(VERSION)
