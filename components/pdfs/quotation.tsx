import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import moment from "moment";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
  },
  section: {
    margin: 10,
    padding: 10,
  },
  flexRowBetween: {
    display: "flex",
    flexDirection: "row",
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    border: "1px solid black",
    margin: 0,
    alignItems: "center",
  },
  w50: {
    width: "50%",
  },
  w40: {
    width: "40%",
  },
  w20: {
    width: "20%",
  },
});

type QuotationProps = {
  name?: string;
  amount?: number;
  date?: string;
  companyName?: string;
  companyAddress?: string;
  companyEmail?: string;
  items?: {
    name: string;
    quantity: number;
    amount: number;
  }[];
};

function capFirst(input: string) {
  return input[0].toUpperCase() + input.slice(1);
}

const Quotation = ({ props }: { props: QuotationProps }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.section, styles.flexRowBetween]}>
          <Text style={{ fontWeight: 900, fontSize: 24, width: "50%" }}>
            {props.name ? capFirst(props.name) : "Quotation"}
          </Text>
          <View style={styles.w50}>
            <Text style={{ fontWeight: 900, fontSize: 24 }}>
              By: {props.companyName}
            </Text>
            <Text style={{ fontSize: 12 }}>
              Address: {props.companyAddress}
            </Text>
            <Text style={{ fontSize: 12 }}>Email: {props.companyEmail}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text>Items</Text>
          <View style={styles.tableRow}>
            <Text style={styles.w40}>Description</Text>
            <Text style={styles.w40}>Quantity</Text>
            <Text style={styles.w20}>Unit Price</Text>
          </View>
          {props.items?.map((item, idx) => {
            return (
              <View style={styles.tableRow} key={`item-${idx}`}>
                <Text style={styles.w40}>{item.name}</Text>
                <Text style={styles.w40}>{item.quantity}</Text>
                <Text style={styles.w20}>{item.amount}</Text>
              </View>
            );
          })}
        </View>
        <View style={styles.section}>
          <Text>Total Amount: {props.amount?.toString()}</Text>
          <Text>Created On: {props.date || moment().format("YYYY/MM/DD")}</Text>
        </View>
        <View style={styles.section}>
          <Text>Authorized by</Text>
          <Text
            style={[
              styles.w40,
              { borderBottom: "1px solid black", height: "24px" },
            ]}
          ></Text>
        </View>
      </Page>
    </Document>
  );
};

export default Quotation;
