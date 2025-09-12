{/* Income + Income Breakdown */}
      <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
        <Col xs={24} md={12}>
          <Collapse defaultActiveKey={['1']} style={{ background: '#fff' }}>
            <Panel header="Income" key="1">
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Row justify="space-between">
                  <Text strong style={{ fontSize: 17 }}>Delivery Charges</Text>
                  <Text style={{ fontSize: 17, color: "#3f8600" }}>
                    Rs: {data.total_income}
                  </Text>
                </Row>
                <Row justify="space-between">
                  <Text strong style={{ fontSize: 17 }}>Tax Charges</Text>
                  <Text style={{ fontSize: 17, color: "#3f8600" }}>
                    Rs: {reportData.income.total_tax_charges.toFixed(2)}
                  </Text>
                </Row>
                <Row justify="space-between">
                  <Text strong style={{ fontSize: 17 }}>Service Charges</Text>
                  <Text style={{ fontSize: 17, color: "#3f8600" }}>
                    Rs: {reportData.income.total_service_charges.toFixed(2)}
                  </Text>
                </Row>
                <Row justify="space-between">
                  <Text strong style={{ fontSize: 17 }}>Product Profits</Text>
                  <Text
                    style={{
                      fontSize: 17,
                      color: reportData.income.total_profits_from_products >= 0 ? "#3f8600" : "#cf1322",
                    }}
                  >
                    Rs: {reportData.income.total_profits_from_products.toFixed(2)}
                  </Text>
                </Row>

                <Divider style={{ margin: "0", borderTop: "2px solid #000" }} />

                <Row justify="space-between">
                  <Text strong style={{ fontSize: 17 }}>Total Income</Text>
                  <Text style={{ fontSize: 17, color: "#3f8600", fontWeight: "bold" }}>
                    Rs: {reportData.income.total_income.toFixed(2)}
                  </Text>
                </Row>
              </div>
            </Panel>
          </Collapse>
        </Col>

        <Col xs={24} md={12}>
          <Collapse defaultActiveKey={['1']} style={{ background: '#fff' }}>
            <Panel header="Income Breakdown" key="1">
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Row justify="space-between">
                  <Text strong style={{ fontSize: 17 }}>Total Income</Text>
                  <Text style={{ fontSize: 17 }}>
                    Rs: {reportData.income.total_income.toFixed(2)}
                  </Text>
                </Row>
                <Row justify="space-between">
                  <Text strong style={{ fontSize: 17 }}>Driver Payments</Text>
                  <Text style={{ fontSize: 17, color: "#cf1322" }}>
                    Rs: {reportData.income.total_payments_for_drivers.toFixed(2)}
                  </Text>
                </Row>
                <Row justify="space-between">
                  <Text strong style={{ fontSize: 17 }}>Company Withdraws</Text>
                  <Text style={{ fontSize: 17, color: "#cf1322" }}>
                    Rs: {reportData.income.total_company_withdraws.toFixed(2)}
                  </Text>
                </Row>

                <Divider style={{ margin: "0", borderTop: "2px solid #000" }} />

                <Row justify="space-between">
                  <Text strong style={{ fontSize: 17 }}>Total Income Balance</Text>
                  <Text style={{ fontSize: 17, color: "#3f8600", fontWeight: "bold" }}>
                    Rs: {reportData.income.total_income_balance.toFixed(2)}
                  </Text>
                </Row>
              </div>
            </Panel>
          </Collapse>
        </Col>
      </Row>